import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public loginForm: FormGroup;
  public empty = true;
  public isInvalid = false;

  public loginCount = 0;

  public timerIsStarting = false;
  public timeLeft: number = 60;
  public interval: any;
  public subscribeTimer: any;

  public formSubmitted = false;

  public errorText = '';

  constructor(
    private router: Router,
    private httpService: HttpService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.email,
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password: new FormControl('', [
        Validators.minLength(6)
      ])
    });

    this.loginForm.valueChanges.subscribe(res => {
      this.empty = !!res.username && !!res.password ? false : true;
    });

  }

  ngOnInit() { }

  get f() { return this.loginForm.controls; }

  doLogin() {
    this.formSubmitted = true;

    // console.log(this.loginForm.controls['password']);
    if (this.loginForm.invalid) {
      this.isInvalid = true

      if (this.loginForm.controls['password']['status'] === 'INVALID') {
        this.errorText = 'Password Minimal 6 Karakter';
      } else if (this.loginForm.controls['username']['status'] === 'INVALID') {
        this.errorText = 'Format Email tidak sesuai';
      }
    } else {

      this.httpService.post('auth/login', this.loginForm.value).subscribe(
        res => {
          // console.log(res);
          localStorage.setItem('token', res.data.token)
          this.moveToHome();
        },
        err => {

          this.errorText = err.error.message;
          this.isInvalid = true;
          this.loginCount++;

          if (this.loginCount >= 3) {
            if (!this.timerIsStarting) {
              this.errorText = 'Terlalu banyak percobaan, pastikan data Email dan Password anda benar.';
              this.startTimer();
            } else {
              this.errorText = 'Terlalu banyak percobaan, coba kembali setelah 1 menit.';
            }

          }
        }
      );
    }

    // console.log(this.loginForm.value);
  }

  moveToHome() {
    this.router.navigateByUrl('');
  }

  startTimer() {
    console.log('start');

    this.timerIsStarting = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timerIsStarting = false;
        this.loginCount = 0;
        this.timeLeft = 60;
      }
    }, 1000)
  }


}
