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
    // this.findRecipes();
  }

  // findRecipes() {
  //   this.recipesSrv.getRecipes('query').subscribe(data => {
  //     this.recipes = data.hits.slice(-3);
  //     console.log(data);
  //   })
  // }

}
