import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  moveToDetail() {
    this.router.navigateByUrl('/123123');
  }

}
