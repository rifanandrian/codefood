import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../services/Global.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  public serving: any = 1;
  public recipe: any;

  public isFromHistory = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private httpService: HttpService) { }

  ngOnInit() {
    this.route.params.subscribe(
      res => {
        this.getDetail(parseInt(res['id']))
      }
    )

    this.route.queryParamMap.subscribe(
      params => {
        const data = params.get('f');
        if (data === 'history') {
          this.isFromHistory = true;
        }
      }
    );

    this.serving = !!JSON.parse(localStorage.getItem('serving')!) ? parseInt(JSON.parse(localStorage.getItem('serving')!)) : 1;
  }

  getDetail(params: number) {
    this.httpService.get(`recipes/${params}?serving=${this.serving}`).subscribe(
      res => {
        this.recipe = res.data;
        this.serving = !!localStorage.getItem(JSON.parse('serving')) ? localStorage.getItem(JSON.parse('serving')) : res.data.nServing;
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

  keyup(value: any) {
    return this.serving = value.target.value;
  }

  backtoHome() {
    localStorage.removeItem('serving');
    if (this.isFromHistory) {
      this.router.navigateByUrl('/history');
    } else {
      this.router.navigateByUrl('');
    }
  }

  toStepPage() {
    localStorage.setItem('serving', JSON.stringify(this.serving));
    this.router.navigateByUrl(`/${this.recipe.id}/step` + '?' + `serving=${this.serving}`);
  }
}
