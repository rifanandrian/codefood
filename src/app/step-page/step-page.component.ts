import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../services/Global.service';
import { HttpService } from '../services/http.service';

export interface listStep {
  description: string;
  stepOrder: number;
  done: boolean;
  attr: string;
}

export interface APIResponse {
  success: boolean,
  message: string,
  data: {}
}

@Component({
  selector: 'app-step-page',
  templateUrl: './step-page.component.html',
  styleUrls: ['./step-page.component.scss']
})
export class StepPageComponent implements OnInit {

  private baseUrl = environment.baseUrl;

  public idRecipe = 0;
  public listSteps: listStep[] = []
  public currentIndex = 0;
  public fullyFinished = false;

  public qtyServing: any;

  public idServeHistory: any;
  public isFromHistory = false;

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private httpService: HttpService) {
  }

  ngOnInit() {

    this.qtyServing = JSON.parse(localStorage.getItem('serving')!);

    this.route.queryParamMap.subscribe(
      params => {
        console.log(params);

        const data = params.get('idHistory');
        if (!!data) {
          this.isFromHistory = true;
          this.getStepRecipeFromHistory(data);
        } else {
          // do nothing
          this.route.params.subscribe(
            res => {
              console.log(res);
              this.idRecipe = parseInt(res['id']);
              this.getStepRecipe(this.idRecipe)
            }
          )
        }
      }
    );
  }

  backToIngridient() {
    if (this.isFromHistory) {
      this.router.navigateByUrl(`/history`);
    } else {
      this.router.navigateByUrl(`/${this.idRecipe}`);
    }
  }

  getStepRecipe(id: number) {
    this.httpService.get(`recipes/${id}/steps`).subscribe(
      res => {
        this.listSteps = res.data.map((resp: any, idx: any) => ({
          ...resp,
          done: false,
          attr: `item-step-${idx}`
        }));
      }
    )
  }

  getStepRecipeFromHistory(idHistory: string) {

    this.httpService.get(`serve-histories/${idHistory}`, '', this.options).subscribe(
      res => {
        console.log(res);
        this.listSteps = res.data.steps.map((res: any, idx: any) => ({
          ...res,
          attr: `item-step-${idx}`
        }));
        this.currentIndex = res.data.nStepDone
      }
    )
  }

  stepFinish(idxStep: number) {
    if (idxStep === 0) {
      const body = {
        'nServing': parseInt(this.qtyServing),
        'recipeId': this.idRecipe
      }

      this.httpService.post('serve-histories', body, this.options).subscribe(
        res => {
          this.idServeHistory = res.data.id;
        }
      )
    }

    for (let idx = 0; idx < this.listSteps.length; idx++) {
      if (idx === idxStep) {
        this.currentIndex = idxStep + 1;
        this.listSteps[idx]['done'] = true;
        if (this.listSteps[idx]['stepOrder'] !== 1) {
          const body = {
            'stepOrder': this.listSteps[idx]['stepOrder'],
          }

          this.httpService.put(`serve-histories/${this.idServeHistory}/done-step`, body, this.options).subscribe(
            res => {
              console.log(res.data);
            },
            err => {
              this.router.navigateByUrl('login');
            }
          );

        }
      }
    }
    this.fullyFinished = this.listSteps.every(v => v.done === true);
  }

  finishAll() {
    localStorage.removeItem('serving');
    this.router.navigateByUrl(`${this.idServeHistory}/rate`);
  }

}
