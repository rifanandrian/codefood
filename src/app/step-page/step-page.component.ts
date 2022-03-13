import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-step-page',
  templateUrl: './step-page.component.html',
  styleUrls: ['./step-page.component.scss']
})
export class StepPageComponent implements OnInit {

  public idRecipe = 0;
  public listSteps = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService) { }

  ngOnInit() {
    this.route.params.subscribe(
      res => {
        console.log(res);
        this.idRecipe = parseInt(res['id']);
        this.getStepRecipe(this.idRecipe)
      }
    )
  }

  backToIngridient() {
    this.router.navigateByUrl(`/${this.idRecipe}`);
  }

  getStepRecipe(id: number) {
    this.httpService.get(`recipes/${id}/steps`).subscribe(
      res => {
        console.log(res);
        this.listSteps = res.data;
      }
    )
  }

}
