import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rate-page',
  templateUrl: './rate-page.component.html',
  styleUrls: ['./rate-page.component.scss']
})
export class RatePageComponent implements OnInit {

  public pageRate = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  backToHome() {
    this.router.navigateByUrl('');
  }

}
