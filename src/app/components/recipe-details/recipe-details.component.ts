import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: any;

  constructor(private recipeSrv: RecipesService, private ar: ActivatedRoute) { }

  ngOnInit(): void {
    let recipeId = this.ar.snapshot.params["id"];
    console.log(recipeId);
    this.findRecipe(recipeId);
  }

  findRecipe(id: string) {
    this.recipeSrv.getRecipeById(id).subscribe(response => {
      this.recipe = response.recipe;
      console.log(this.recipe);

    });
  }

  getBackgroundImageStyle(imageUrl: string) {
    return {
      'background-image': `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`
    };
  }

}
