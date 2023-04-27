import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if (this.email == '' || this.password == '') {
      this.error = 'Please insert correct credentials.';
      return;
    }

    this.auth.login(this.email, this.password);
  }

}
