import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  // Per fare la registrazione
  register() {
    if (this.email == '' || this.password == '') {
      this.error = 'Please insert correct credentials.';
      return;
    }

    this.auth.register(this.email, this.password);
  }

}
