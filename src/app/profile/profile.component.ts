import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getMyUser().subscribe(
      result => {
        this.user = result[0];
      },
      err => {
        console.log(err);
      }
    );
  }

}
