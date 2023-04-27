import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FavRecipe } from '../models/fav-recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  // Per fare il login
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');

      if (res.user?.emailVerified == true) {
        this.router.navigate(['calendar']);
      } else {
        this.router.navigate(['verify-email']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['login']);
    })
  }

  // Per fare il signup
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      alert('Registration Successful');

      if(res.user) {
        // this.addUserWithFavRecipes(res.user.uid);
        this.SetUserDataRegister(res.user.uid)
        this.sendEmailForVarification(res.user);
      } else {
        console.log('errore nel caricare fav-recipe');
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  // Per fare il logout
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // Per inviare email di verifica
  sendEmailForVarification(user: any) {
    console.log(user);
    user.sendEmailVerification().then((res: any) => {
      this.router.navigate(['/verify-email']);
    }, (err: any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  // Per aggiungere al firestore la lista delle ricette preferite dell'utente
  // addUserWithFavRecipes(id: string) {
  //   let favRecipes: string[] = [];
  //   const userRef = this.firestore.collection('users').doc(id);

  //   return userRef.set({
  //     id: id,
  //     favRecipes: favRecipes
  //   });
  // }

  // Per ripristinare password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      alert('Something went wrong');
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

  // Imposta i dati dell'utente per il register con username/password
  SetUserDataRegister(userId: string) {
    let favs: string[] = [];

    const userRef = this.firestore.doc(
      `users/${userId}`
    );
    const userData: FavRecipe = {
      recipes: favs
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

}
