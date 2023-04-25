import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) { }

  // getRecipes(): Observable<any> {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json');

  //   const params = new HttpParams({ fromObject: {
  //     q: 'vegan',
  //     type: 'public',
  //     app_id: 'd84b34a5',
  //     app_key: '1163caf9de0e70fb5c44bd3e655467c0',
  //     field: ['calories', 'cuisineType', 'dishType', 'image', 'ingredientLines', 'label', 'healthLabels', 'mealType', 'source', 'totalTime', 'tags', ]
  //   }});

  //   return this.http.get('https://api.edamam.com/api/recipes/v2', { headers, params });
  // }

  // getRecipeById(id: string): Observable<any> {
  //   return this.http.get(`https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=d84b34a5&app_key=1163caf9de0e70fb5c44bd3e655467c0`);
  // }

}
