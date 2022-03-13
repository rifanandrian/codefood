import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestOptions } from '../models/request-options.model';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  constructor(private router: Router,
    private httpService: HttpService) {
    this.getHistory();
  }

  ngOnInit() {
  }

  getHistory() {
    let token: any;
    if (!!localStorage.getItem('token')) {
      token = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    this.httpService.get('serve-histories', '', token).subscribe(
      res => {
        console.log(res);
      },
      err => {
        if (err.status === 401) {
          this.router.navigateByUrl('login');
        }
      }
    )
  }

  moveToDetail() {
    this.router.navigateByUrl('/123123');
  }

}
