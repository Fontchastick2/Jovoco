import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findById(userId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { userId } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async login(email: string, passwordHash: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (user && user.passwordHash === passwordHash) {
            return user;
        }
        return null;
    }

    async logout(userId: string): Promise<void> {
        // Logique de logout (peut être implémentée avec des tokens)
    }

    async updateProfile(userId: string, updateData: Partial<User>): Promise<User | null> {
        await this.usersRepository.update(userId, updateData);
        return this.findById(userId);
    }

    async delete(userId: string): Promise<void> {
        await this.usersRepository.delete(userId);
    }
}
