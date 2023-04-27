import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CuisineType } from 'src/app/enums/cuisine-type.enum';
import { MealType } from 'src/app/enums/meal-type.enum';
import { HttpParams } from '@angular/common/http';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  recipes: any[] = [];
  mealTypes = Object.values(MealType);
  cuisineTypes = Object.values(CuisineType);

  constructor(private recipesSrv: RecipesService) { }

  ngOnInit(): void {
    this.findRecipes();
  }

  findRecipes() {
    this.recipesSrv.getRecipes('query').subscribe(data => {
      this.recipes = data.hits;
      console.log(data);

    })
  }

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

  // -----------------------------------------------------------------------------------------

  addToFavorites(recipeId: string) {
    console.log('ok');
  }

}
