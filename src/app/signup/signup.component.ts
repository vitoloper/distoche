import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  data = {
    username: null,
    email: null,
    nome: null,
    cognome: null,
    data_nascita: null,
    citta_residenza: null,
    password: null
  };
  isErrorAlertHidden = true;
  errorText = '';

  passwordConfirm = null;

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isErrorAlertHidden = true;

    if (this.data.password !== this.passwordConfirm) {
      this.errorText = 'Le password non coincidono. Digitare correttamente la password di conferma.';
      this.isErrorAlertHidden = false;
      return;
    }

    this.authService.signup(this.data).subscribe(
      signupResult => {
        // Correctly registered, perform login
        this.authService.login(this.data.username, this.data.password).subscribe(
          loginResult => {
            this.router.navigate(['/']);
          },
          loginErr => {
            console.log(loginErr);
            this.errorText = 'Errore nel processo di login';
            this.isErrorAlertHidden = false;
          }
        );
      },
      signupErr => {
        console.log(signupErr);
        this.errorText = signupErr.message || 'Errore nel processo di registrazione utente';
        this.isErrorAlertHidden = false;
      }
    );

  }

}
