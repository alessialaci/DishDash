import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.interface';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  recipes: any[] = [];

  constructor(private recipesSrv: RecipesService) { }

  ngOnInit(): void {
    this.findRecipes();
  }

  // Per recuperare le ultime 4 ricette
  findRecipes() {
    this.recipesSrv.getRecipes('italian').subscribe(data => {
      this.recipes = data.hits.slice(-4);
    })
  }

}
