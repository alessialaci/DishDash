import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FavRecipe } from '../models/fav-recipe.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) { }

  getRecipes(query: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const params = new HttpParams({ fromObject: {
      q: query,
      type: 'public',
      app_id: 'd84b34a5',
      app_key: '1163caf9de0e70fb5c44bd3e655467c0',
      field: ['calories', 'cuisineType', 'dishType', 'image', 'ingredients', 'label', 'healthLabels', 'mealType', 'source', 'totalTime', 'tags', 'uri', 'url' ]
    }});

    return this.http.get('https://api.edamam.com/api/recipes/v2', { headers, params });
  }

  getFilteredRecipes(params: HttpParams): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get('https://api.edamam.com/api/recipes/v2', { headers, params });
  }

  getRecipeById(id: string): Observable<any> {
    return this.http.get(`https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=d84b34a5&app_key=1163caf9de0e70fb5c44bd3e655467c0`);
  }

  addFavRecipe(favs: FavRecipe) {
    return this.http.post('https://64493726b88a78a8f001273f.mockapi.io/api/v1/users', favs)
  }

  getRecords(): Observable<any> {
    return this.http.get<any[]>('https://64493726b88a78a8f001273f.mockapi.io/api/v1/users')
  }

  updateRecord(id: number, user: Partial<User>) {
    return this.http.put(`https://64493726b88a78a8f001273f.mockapi.io/api/v1/users/${id}`, user)
  }

  getUserByUserId(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users?userId=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.userId === userId);
        return user ? user.id : null;
      })
    );
  }

  getEventsByUserId(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users?userId=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.userId === userId);
        return user ? user.events : null;
      })
    );
  }

  getFavsByUserId(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users?userId=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.userId === userId);
        return user ? user.recipes : null;
      })
    );
  }

}
