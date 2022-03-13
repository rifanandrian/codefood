import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RequestOptions } from '../models/request-options.model';
import { GlobalService } from '../services/Global.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  public listHistory = [];
  private baseUrl = environment.baseUrl;

  public listenFilterRecipe: any;
  public idRecipe = 99;
  public filterUrutkan = [
    { key: 'newest', name: 'Terbaru', selected: true },
    { key: 'oldest', name: 'Terbaru', selected: false },
    { key: 'nserve_desc', name: 'Terbaru', selected: false },
    { key: 'nserve_asc', name: 'Terbaru', selected: false },
  ]

  public sum = 20;
  public direction = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private globalService: GlobalService,
    private httpService: HttpService) {
    this.getHistory();
  }

  ngOnInit() {
    this.listenFilterRecipe = this.globalService.updateRecipe.subscribe(
      idRecipe => {
        this.idRecipe = idRecipe;
        if (idRecipe !== 99) {
          this.getHistory('', '?categoryId=' + this.idRecipe);
        } else {
          this.checkingFilter('newest');
        }

      }

    )
  }

  getHistory(sort?: string, categoryId?: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
    this.httpService.get(`serve-histories${!!categoryId ? categoryId : ''}${!!sort ? sort : ''}`, '', options).subscribe(
      res => {
        console.log(res);
        this.listHistory = res.data.history.map(
          (res: any) => ({
            ...res,
            percentage: res.nStep === res.nStepDone ? '100' : Math.round(((100 * res.nStepDone) / res.nStep)),
            icon: res['reaction'] === 'like' ? 'assets/img/green-rating.png' : res['reaction'] === 'neutral' ? 'assets/img/yellow-rating.png' : res['reaction'] === 'dislike' ? 'assets/img/red-rating.png' : '',
            indReaction: res['reaction'] === 'like' ? 'Yummy!' : res['reaction'] === 'neutral' ? 'Lumayan' : res['reaction'] === 'dislike' ? 'Kurang Suka' : ''
          })
        );
      }
    )
  }

  checkingFilter(key: string) {
    for (let idx = 0; idx < this.filterUrutkan.length; idx++) {
      if (key === this.filterUrutkan[idx]['key']) {
        this.filterUrutkan[idx]['selected'] = true;
      } else {
        this.filterUrutkan[idx]['selected'] = false;
      }

    }

    if (key === 'newest') {
      this.getHistory('', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
    } else if (key === 'oldest') {
      this.getHistory('?sort=oldest', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
    } else if (key === 'nserve_asc') {
      this.getHistory('?sort=nserve_asc', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
    } else if (key === 'nserve_desc') {
      this.getHistory('?sort=nserve_desc', this.idRecipe === 99 ? '' : '?categoryId=' + this.idRecipe);
    }

  }

  moveToDetail() {
    this.router.navigateByUrl('/123123');
  }

  toRatingPage(idx: number) {
    this.router.navigateByUrl(`${this.listHistory[idx]['id']}/rate`);
  }

  toStepPage(idx: number, status: string) {
    if (status === 'progress') {
      this.router.navigateByUrl(`${this.listHistory[idx]['recipeId']}/step` + '?' + `idHistory=${this.listHistory[idx]['id']}`);
    } else {
      localStorage.setItem('serving', this.listHistory[idx]['nServing']);
      this.router.navigateByUrl(`${this.listHistory[idx]['recipeId']}` + '?' + `f=history`);
    }
  }

  // inifinite scroll
  onScrollDown(ev: any) {
    console.log("scrolled down!!", ev);

    this.sum += 20;
    this.appendItems();

    this.direction = "scroll down";
  }

  onScrollUp(ev: any) {
    console.log("scrolled up!", ev);
    this.sum += 20;
    this.prependItems();

    this.direction = "scroll up";
  }

  appendItems() {
    this.addItems("push");
  }

  prependItems() {
    this.addItems("unshift");
  }

  addItems(_method: string) {
    for (let i = 0; i < this.sum; ++i) {
      if (_method === 'push') {
        // this.listHistory.push([i].join(""));
      } else if (_method === 'unshift') {
        // this.listHistory.unshift([i].join(""));
      }
    }
  }

}
