import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private authSrv: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authSrv.logout();
  }

  isLoggedIn() {
    return this.authSrv.isLoggedIn();
  }

}
