import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
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

export interface Options {
  id: number;
  name: string;
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



  // HEader
  public hideNavbar = false;
  public isHistory = false;
  public recipeIsSet = false;
  public recipeIsId = 0;
  public recipeCategory = [{ 'id': 99, 'name': 'Semua', 'selected': true, 'attr': '' }];
  public selectedCategory = 0;

  public myControl = new FormControl();
  public options: Options[] = [];
  public filteredOptions: Observable<Options[]> | undefined;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpsService: HttpService,
    private headerService: HeaderService) {


    // Header
    this.route.params.subscribe(res => {
      this.hideNavbar = !!res['id'] ? true : false;
    })
    console.log(this.router.url);

    this.isHistory = this.router.url === '/history' ? true : false;
  }

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



    // header
    this.getRecipeCategory();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
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

  // Heasder



  private _filter(value: string): Options[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  keyup(event: any) {
    const value = event.target.value;
    console.log(value);
    if (value.length >= 2) {
      this.httpsService.get(`search/recipes?limit&q=${value}`).subscribe(
        res => {
          this.options = res.data;
        }
      )
    } else {
      this.options = [];
    }
  }

  getRecipeCategory() {
    this.httpsService.get(`recipe-categories`).subscribe(
      res => {
        const responseData = res['data'].map((category: any) => ({
          ...category,
          selected: false
        }));
        const tempArr = [...this.recipeCategory, ...responseData]
        this.recipeCategory = tempArr.map((res, idx) => ({
          ...res,
          attr: `category-button-${idx}`
        }))
      }
    )
  }

  selectCategory(id: number) {
    this.selectedCategory = id;
    for (let idx = 0; idx < this.recipeCategory.length; idx++) {
      if (this.recipeCategory[idx]['id'] === id) {
        this.recipeCategory[idx]['selected'] = true;
        this.headerService.updateMainRecipe(this.recipeCategory[idx]['id']);
      } else {
        this.recipeCategory[idx]['selected'] = false;
      }

    }
  }

  setRecipe(val: number) {
    this.recipeIsSet = true;
    this.recipeIsId = val
  }

  goSearchRecipe() {
    console.log(this.recipeIsSet, this.recipeIsId);
    this.router.navigateByUrl(`${this.recipeIsId}`)
  }

  moveToHistory() {
    this.router.navigateByUrl('history');
  }

  moveToHome() {
    this.router.navigateByUrl('');
  }

}
