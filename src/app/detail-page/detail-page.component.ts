import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  public serving = 1;
  public recipe: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService) { }

  ngOnInit() {
    this.route.params.subscribe(
      res => {
        this.getDetail(parseInt(res['id']))
      }
    )
  }

  getDetail(params: number) {
    this.httpService.get(`recipes/${params}?serving=${this.serving}`).subscribe(
      res => {
        this.recipe = res.data;
        this.serving = res.data.nServing;
      }
    )

  }

  countServing(type: string) {
    if (type === 'minus') {
      this.serving--;
      if (this.serving < 0) { this.serving = 0; }
    } else {
      this.serving++;
    }
  }

  backtoHome() {
    this.router.navigateByUrl('');
  }

  toStepPage() {
    this.router.navigateByUrl(`/${this.recipe.id}/step`);
  }
}
