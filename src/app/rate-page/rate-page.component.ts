import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-rate-page',
  templateUrl: './rate-page.component.html',
  styleUrls: ['./rate-page.component.scss']
})
export class RatePageComponent implements OnInit {

  public idServeHistory = '';
  public pageRate = true;

  public dsbBtnRating: boolean = true;

  public rates = [
    { attr: 'button-like', text: 'Yummy!', image: 'assets/img/puas.png', selected: false, value: 'like' },
    { attr: 'button-neutral', text: 'Lumayan', image: 'assets/img/stdr.png', selected: false, value: 'neutral' },
    { attr: 'button-dislike', text: 'Kurang Suka', image: 'assets/img/tdk-puas.png', selected: false, value: 'dislike' },
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {
    this.route.params.subscribe(
      res => {
        this.idServeHistory = res['id'];
      }
    )
  }

  ngOnInit() {
    console.log(this.dsbBtnRating);

  }

  backToHome() {
    this.router.navigateByUrl('');
  }

  setRate(idx: number) {
    for (let i = 0; i < this.rates.length; i++) {
      if (idx === i) {
        this.rates[i]['selected'] = true;
      } else {
        this.rates[i]['selected'] = false;
      }

    }

    this.dsbBtnRating = this.rates.every(data => data.selected === true);
  }

  sendRating() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };

    const dataValue = this.rates.filter(e => e.selected);
    const body = {
      "reaction": dataValue[0]['value']
    }

    this.httpService.post(`serve-histories/${this.idServeHistory}/reaction`, body, options).subscribe(
      res => {
        if (res.success) {
          this.pageRate = !this.pageRate;
        }
      }
    );
  }

}
