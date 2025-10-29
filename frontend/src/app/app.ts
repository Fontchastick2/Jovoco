import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, UsersComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Jovoco - Full Stack App';
}
