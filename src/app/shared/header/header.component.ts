import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/Global.service';
import { HttpService } from 'src/app/services/http.service';

export interface Options {
  id: number;
  name: string;
  attr: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public hideNavbar = false;
  public isHistory = false;
  public recipeIsSet = false;
  public recipeIsId = 0;
  public recipeCategory = [{ 'id': 99, 'name': 'Semua', 'selected': true, 'attr': '' }];
  public selectedCategory = 0;

  public myControl = new FormControl();
  public options: Options[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private GlobalService: GlobalService) {
    this.route.params.subscribe(res => {
      this.hideNavbar = !!res['id'] ? true : false;
    })

    this.isHistory = this.router.url === '/history' ? true : false;
    document.getElementById('autocomplete-box')?.classList.add('hidden');
    document.getElementById('autocomplete-box')?.classList.add('box');
  }

  ngOnInit() {
    this.getRecipeCategory();

  }

  keyup(event: any) {
    const value = event.target.value;
    if (value.length > 1) {
      document.getElementById('autocomplete-box')?.classList.remove('hidden');
      document.getElementById('autocomplete-box')?.classList.remove('box');

      this.httpService.get(`search/recipes?limit&q=${value}`).subscribe(
        res => {
          this.options = res.data.map((res: any, idx: any) => ({
            ...res,
            attr: `search-suggestion-${idx}`
          }));
        }
      )
    } else {
      document.getElementById('autocomplete-box')?.classList.add('hidden');
      document.getElementById('autocomplete-box')?.classList.add('box');
      this.options = [];
    }
  }

  getRecipeCategory() {
    this.httpService.get(`recipe-categories`).subscribe(
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
        this.GlobalService.updateMainRecipe(this.recipeCategory[idx]['id']);
      } else {
        this.recipeCategory[idx]['selected'] = false;
      }

    }
  }

  clearInput() {
    document.getElementById('autocomplete-box')?.classList.add('hidden');
    document.getElementById('autocomplete-box')?.classList.add('box');
    this.myControl.setValue('');
    this.options = [];
  }

  setRecipe(val: number) {
    this.recipeIsSet = true;
    this.recipeIsId = val
  }

  goSearchRecipe(id?: number) {
    // console.log(this.recipeIsSet, this.recipeIsId);
    if (!!id) {
      this.router.navigateByUrl(`${!!id ? id : this.recipeIsId}`)
    } else {
      this.GlobalService.updateListRecipe(this.myControl.value);
    }
  }

  moveToHistory() {
    this.router.navigateByUrl('history');
  }

  moveToHome() {
    this.router.navigateByUrl('');
  }
}
