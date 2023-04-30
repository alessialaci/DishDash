import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { CuisineType } from 'src/app/enums/cuisine-type.enum';
import { MealType } from 'src/app/enums/meal-type.enum';
import { User } from 'src/app/models/user.interface';
import { RecipesService } from 'src/app/services/recipes.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  favs: string[] = [];
  recipes: any[] = [];
  mealTypes = Object.values(MealType);
  cuisineTypes = Object.values(CuisineType);
  error: string = '';

  constructor(private recipesSrv: RecipesService, private usersSrv: UsersService, private authSrv: AuthService) { }

  ngOnInit(): void {
    this.findRecipes();
    this.getIdFavs();
  }

  // Per controllare se l'utente è loggato
  isLoggedIn() {
    return this.authSrv.isLoggedIn();
  }

  // Per recuperare la lista di ricette
  findRecipes() {
    this.recipesSrv.getRecipes('query').subscribe(data => {
      this.recipes = data.hits;
    })
  }

  // Per recuperare tutti gli id dei preferiti dell'utente loggato
  getIdFavs() {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.usersSrv.getFavsByUserId(parseUser.user.uid).subscribe(res => {
      this.favs = res;
    });
  }

  // Per filtrare le ricette
  sendFilters(form: NgForm) {
    let query: string;
    if(form.value.cuisineType !== '') {
      query = form.value.cuisineType
    } else if(form.value.mealType !== '') {
      query = form.value.mealType
    } else {
      query = 'query'
    }

    const paramsObj: any = {
      q: query,
      type: 'public',
      app_id: 'd84b34a5',
      app_key: '1163caf9de0e70fb5c44bd3e655467c0',
      field: ['calories', 'cuisineType', 'dishType', 'image', 'ingredients', 'label', 'healthLabels', 'mealType', 'source', 'totalTime', 'tags', 'uri', 'url'],
    };

    if (form.value.ingredients !== '') {
      if(form.value.ingredients > 1) {
        paramsObj.ingr = form.value.ingredients;
      } else {
        this.error = 'Please insert a correct number';
        return;
      }
    }

    if (form.value.cuisineType !== '') {
      paramsObj.cuisineType = form.value.cuisineType;
    }

    if (form.value.mealType !== '') {
      paramsObj.mealType = form.value.mealType;
    }

    if (form.value.mincalories !== '' && form.value.maxcalories !== '') {
      if(form.value.mincalories > 1 && form.value.maxcalories > 1) {
        paramsObj.calories = form.value.mincalories + '-' + form.value.maxcalories;
      } else {
        this.error = 'Please insert a correct number';
        return;
      }
    }

    const params = new HttpParams({ fromObject: paramsObj });

    this.recipesSrv.getFilteredRecipes(params).subscribe(data => {
      this.recipes = data.hits;
      console.log(data);

    });

    console.log('fav');

    this.getIdFavs();
  }

  // Per aggiungere/eliminare una ricetta dai preferiti...
  addFavRecipe(recipeId: string) {
    this.getUser(recipeId)
  }

  // ...recuperando l'utente tramite l'id...
  getUser(recipeId: string) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.usersSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
      this.updateUser(res, recipeId, parseUser.user.uid);
    })
  }

  // ...e aggiornando i suoi preferiti
  updateUser(id: number, recipeId: string, userId: string) {
    this.usersSrv.getFavsByUserId(userId).subscribe(res => {
      this.favs = res;

      const index = this.favs.indexOf(recipeId);
      if (index > -1) {
        this.favs.splice(index, 1);
      } else {
        this.favs.push(recipeId);
      }

      let newUser: Partial<User> = {
        recipes: this.favs
      }

      this.usersSrv.updateFavs(id, newUser).subscribe(res => {
        console.log(res);
      })
    });
  }

  // Per controllare se una ricetta fa parte dei preferiti
  isFav(recipeId: string) {
    return this.favs.includes(recipeId);
  }

  // Per recuperare le ricette tramite una parola specifica
  // findSpecificRecipes(q: string) {
  //   this.recipesSrv.getRecipes(q).subscribe(data => {
  //     this.recipes = data.hits.slice(-3);
  //   })
  // }

}
