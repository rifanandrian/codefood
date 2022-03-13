import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RequestOptions } from '../models/request-options.model';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  private baseUrl = environment.baseUrl;

  constructor(private router: Router,
    private http: HttpClient,
    private httpService: HttpService) {
    this.getHistory();
  }

  ngOnInit() {
  }

  getHistory() {
    const requestOptions: RequestOptions = new RequestOptions();
    const token = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });


    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };

    requestOptions.headers = token;
    console.log(requestOptions);
    this.httpService.get('serve-histories', '', options).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  moveToDetail() {
    this.router.navigateByUrl('/123123');
  }

}
