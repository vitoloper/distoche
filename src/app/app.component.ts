import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { User } from './_models/user';
import { Role } from './_models/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DiStoCHe';
  user: User;

  constructor(private authService: AuthenticationService) {
    this.authService.user.subscribe(x => this.user = x);
  }

  logout(): void {
    this.authService.logout();
  }

  get isEsperto() {
    return this.user && this.user.role === Role.esperto;
  }

  get isFruitore() {
    return this.user && this.user.role === Role.fruitore;
  }

  get isGestore() {
    return this.user && this.user.role === Role.gestore;
  }
}
