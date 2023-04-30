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

  constructor(private recipesSrv: RecipesService, private ar: ActivatedRoute) { }

  ngOnInit(): void {
    let recipeId = this.ar.snapshot.params["id"];
    this.findRecipe(recipeId);
  }

  // Per recuperare la ricetta tramite id
  findRecipe(id: string) {
    this.recipesSrv.getRecipeById(id).subscribe(response => {
      this.recipe = response.recipe;
    });
  }

  // Per impostare l'immagine della ricetta come sfondo nel css
  getBackgroundImageStyle(imageUrl: string) {
    return {
      'background-image': `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`
    };
  }

}
