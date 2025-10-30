import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Jovoco - Full Stack App';
}
