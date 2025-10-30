import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await this.usersService.create({
      name,
      email,
      passwordHash: hashedPassword,
    });

    // Générer le token JWT
    const token = this.jwtService.sign({
      sub: user.userId,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.jwtService.sign({
      sub: user.userId,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
      },
    };
  }
}
