import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  isSavedOkAlertHidden = true;
  isSaveErrorAlertHidden = true;
  errorText = 'Errore.';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getMyUser();
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  /**
   * Get profile info
   */
  getMyUser(): void {
    this.userService.getMyUser().subscribe(
      result => {
        this.user = result[0];
      },
      err => {
        this.errorText = 'Impossibile ottenere le informazioni sul profilio utente.';
        this.isSaveErrorAlertHidden = false;
        console.log(err);
        this.scrollToBottom();
      }
    );
  }

  /**
   * Form submit
   * 
   */
  onSubmit(): void {
    if (!this.user.username || !this.user.email) {
      this.errorText = 'I campi contrassegnati in rosso sono obbligatori.';
      this.isSaveErrorAlertHidden = false;

      // Scroll to the bottom of the page
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 150);

      return;
    }

    if (!this.validateEmail(this.user.email)) {
      this.errorText = 'Email non valida';
      this.isSaveErrorAlertHidden = false;

      // Scroll to the bottom of the page
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 150);
      
      return;
    }

    this.userService.updateMyUser(this.user).subscribe(
      result => {
        this.isSavedOkAlertHidden = false;
        this.isSaveErrorAlertHidden = true;
        this.scrollToBottom();
      },
      err => {
        this.errorText = 'Errore salvataggio informazioni profilo. Riprovare.'
        this.isSaveErrorAlertHidden = false;
        this.isSavedOkAlertHidden = true;
        console.log(err);
        this.scrollToBottom();
      }
    );
  }

  /**
   * Scroll to the bottom of the page
   * 
   */
  scrollToBottom(): void {
    // Scroll to the bottom of the page
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 150);
  }
}
