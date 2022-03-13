import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';

export interface Recipes {
  attr: string;
  createdAt: string
  id: number;
  image: string;
  nReactionDislike: number;
  nReactionLike: number;
  nReactionNeutral: number;
  name: string;
  recipeCategory: { id: number; name: string; createdAt: string; updatedAt: string }
  recipeCategoryId: number;
  updatedAt: string;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public recipes: Recipes[] = [];
  public poolrecipe = [];
  public listenFilterRecipe: any;
  public idRecipe = 99;

  public filterUrutkan = [
    { key: 'new', name: 'Terbaru', selected: true },
    { key: 'asc', name: 'Terbaru', selected: false },
    { key: 'dsc', name: 'Terbaru', selected: false },
    { key: 'most_like', name: 'Terbaru', selected: false },
  ]

  constructor(private router: Router,
    private httpsService: HttpService,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.checkingFilter('new');

    this.listenFilterRecipe = this.headerService.updateRecipe.subscribe(
      idRecipe => {
        // let tempData: never[] = [];
        // for (let idx = 0; idx < this.poolrecipe.length; idx++) {
        //   if (this.poolrecipe[idx]['recipeCategoryId'] === idRecipe) {
        //     tempData.push(this.poolrecipe[idx]);
        //   } else if (idRecipe === 99) {
        //     tempData = this.poolrecipe
        //   }

        // }
        // this.recipes = tempData
        // console.log(tempData);

        this.idRecipe = idRecipe;
        if (idRecipe !== 99) {
          this.getItems('', '?categoryId=' + this.idRecipe);
        } else {
          this.checkingFilter('new');
        }

      }

    )
  }

  getItems(sort?: string, categoryId?: string) {
    this.httpsService.get(`recipes${!!categoryId ? categoryId : ''}${!!sort ? sort : ''}`).subscribe(
      res => {
        const responseData = res.data.recipes;
        this.recipes = responseData.map((res: any, idx: any) => ({
          ...res,
          attr: `list-item-${idx}`
        }));
        // this.poolrecipe = ths.recipes;
        console.log(this.recipes);

      }
    )
  }

  moveToDetail(id: number) {
    this.router.navigateByUrl(`/${id}`);
  }

  checkingFilter(key: string) {
    for (let idx = 0; idx < this.filterUrutkan.length; idx++) {
      if (key === this.filterUrutkan[idx]['key']) {
        this.filterUrutkan[idx]['selected'] = true;
      } else {
        this.filterUrutkan[idx]['selected'] = false;
      }

      if (key === 'new') {
        this.getItems('', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
      } else if (key === 'asc') {
        this.getItems('?sort=name_asc', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
      } else if (key === 'dsc') {
        this.getItems('?sort=name_desc', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
      } else if (key === 'most_like') {
        this.getItems('?sort=like_desc', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
      }

    }

  }

}
