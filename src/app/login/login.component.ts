import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;
  returnUrl;
  errorText = '';
  isErrorAlertHidden = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    this.isErrorAlertHidden = true;
    this.authService.login(this.username, this.password)
      .pipe(first())
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);
      }, err => {
        if (err.status === 400) {
          this.errorText = 'Username o password non validi.'
        } else {
          this.errorText = err.error.message;
        }

        this.isErrorAlertHidden = false;
        console.log(err);
      });
  }
}
