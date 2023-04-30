import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // Per recuperare l'utente tramite user id di Firebase
  getUserByUserId(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users?userId=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.userId === userId);
        return user ? user.id : null;
      })
    );
  }

  // Per recuperare i preferiti tramite user id di Firebase
  getFavsByUserId(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users?userId=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.userId === userId);
        return user ? user.recipes : [];
      })
    );
  }

  // Per modificare i preferiti dell'utente
  updateFavs(id: number, user: Partial<User>) {
    return this.http.put(`https://64493726b88a78a8f001273f.mockapi.io/api/v1/users/${id}`, user)
  }

}
