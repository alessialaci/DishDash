import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private http: HttpClient, private router: Router) { }

  // Per fare il login
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', JSON.stringify(res));

      if (res.user?.emailVerified == true) {
        this.router.navigate(['recipes']);
      } else {
        this.router.navigate(['verify-email']);
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
      this.router.navigate(['login']);
    })
  }

  // Per fare il signup
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {

      if(res.user) {
        this.setUserData(res.user.uid)
        this.sendEmailForVarification(res.user);

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        console.log('errore nel caricare fav-recipe');
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
      this.router.navigate(['/register']);
    })
  }

  // Per popolare il mockAPI con i riferimenti dell'utente registrato
  setUserData(email: string) {
    let favs: string[] = [];

    let user = {
      userId: email,
      recipes: favs
    }

    return this.http.post('https://64493726b88a78a8f001273f.mockapi.io/api/v1/users', user).subscribe(res => {
      console.log(res);
    })
  }

  // Per fare il logout
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    })
  }

  // Per inviare email di verifica
  sendEmailForVarification(user: any) {
    user.sendEmailVerification().then((res: any) => {
      this.router.navigate(['/verify-email']);
    }, (err: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Not able to send mail to your email.',
      })
    })
  }

  // Per ripristinare password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong.',
      })
    })
  }

  // Per verificare se un utente è loggato
  public isLoggedIn() {
    const user = window.localStorage.getItem('token');
    if (user) {
      return true;
    }
    this.router.createUrlTree(['/login']);
    return false;
  }

}
