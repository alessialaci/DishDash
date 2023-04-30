import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  // Per inviare l'email e recuperare la password
  forgotPassword() {
    this.auth.forgotPassword(this.email);
  }

}
