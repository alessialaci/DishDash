import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CuisineType } from 'src/app/enums/cuisine-type.enum';
import { MealType } from 'src/app/enums/meal-type.enum';
import { HttpParams } from '@angular/common/http';
import { RecipesService } from 'src/app/services/recipes.service';
import { FavRecipe } from 'src/app/models/fav-recipe.interface';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  favs: string[] = [];
  recipes: any[] = [];
  favRecipes: string[] = [];
  mealTypes = Object.values(MealType);
  cuisineTypes = Object.values(CuisineType);

  constructor(private recipesSrv: RecipesService) { }

  ngOnInit(): void {
    // this.findRecipes();
    // this.getIdFavs()
  }

  // Per recuperare la lista di ricette
  findRecipes() {
    this.recipesSrv.getRecipes('query').subscribe(data => {
      this.recipes = data.hits;
      console.log(data);

    })
  }

  // getIdFavs() {
  //   const user = window.localStorage.getItem('token');
  //   const parseUser = JSON.parse(user!);

  //   this.recipesSrv.getFavsByUserId(parseUser.user.id).subscribe(res => {
  //     this.favs = res;
  //     console.log(res);

  //   });
  // }

  // findSpecificRecipes(q: string) {
  //   this.recipesSrv.getRecipes(q).subscribe(data => {
  //     this.recipes = data.hits.slice(-3);
  //   })
  // }

  // sendFilters(form: NgForm) {
  //   const paramsObj: any = {
  //     q: 'query',
  //     type: 'public',
  //     app_id: 'd84b34a5',
  //     app_key: '1163caf9de0e70fb5c44bd3e655467c0',
  //     field: ['calories', 'cuisineType', 'dishType', 'image', 'ingredientLines', 'label', 'healthLabels', 'mealType', 'source', 'totalTime', 'tags'],
  //   };

  //   if (form.value.ingredients !== "") {
  //     paramsObj.ingr = form.value.ingredients;
  //   }

  //   if (form.value.cuisineType !== "") {
  //     paramsObj.cuisineType = form.value.cuisineType;
  //   }

  //   if (form.value.mealType !== "") {
  //     paramsObj.mealType = form.value.mealType;
  //   }

  //   if (form.value.mincalories !== "" && form.value.maxcalories !== "") {
  //     paramsObj.calories = form.value.mincalories + '-' + form.value.maxcalories;
  //   }

  //   const params = new HttpParams({ fromObject: paramsObj });

  //   this.recipesSrv.getFilteredRecipes(params).subscribe(data => {
  //     console.log(params);

  //     this.recipes = data.hits;
  //     console.log(data.hits);
  //   });
  // }

  // Per aggiungere una ricetta ai preferiti...
  addFavRecipe(recipeId: string) {
    this.getUser(recipeId)
  }

  // ...recuperando l'utente tramite l'id...
  getUser(recipeId: string) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.recipesSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
      this.updateUser(res, recipeId, parseUser.user.uid);
    })
  }

  // ...e aggiornando i suoi dati (in questo caso i preferiti)
  updateUser(id: number, recipeId: string, userId: string) {
    this.recipesSrv.getFavsByUserId(userId).subscribe(res => {
      this.favs = res;
      this.favs.push(recipeId)

      let newUser: Partial<User> = {
        recipes: this.favs
      }

      this.recipesSrv.updateRecord(id, newUser).subscribe(res => {
        console.log(res);
      })
    });
  }

}
