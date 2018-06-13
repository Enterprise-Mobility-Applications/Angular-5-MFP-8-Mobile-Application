import { Injectable } from '@angular/core';

@Injectable()
export class CountdownTimerService {
  currentTime: string;
  today: Date;
  newDate: Date;
  countDownDate: any;
  x: any;
  isTimerRunning: boolean;

  constructor() {
    this.isTimerRunning = false;
  }

  public startServiceTimer(interval_Minutes: number) {
    this.stopServiceTimer();
    console.log('I am in startServiceTimer');
    this.currentTime = '';
    this.today = new Date();
    this.newDate = new Date(
      this.today.getTime() + interval_Minutes * 60000 + 1000
    );
    this.countDownDate = this.newDate.getTime();
    this.isTimerRunning = true;
    // Update the count down every 1 second
    this.x = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.countDownDate - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (seconds < 10) {
        this.currentTime = '0' + minutes + ':0' + seconds + '';
      } else if (minutes > 10) {
        this.currentTime = minutes + ':' + seconds + '';
      } else {
        this.currentTime = '0' + minutes + ':' + seconds + '';
      }

      if (distance < 0) {
        clearInterval(this.x);
        this.currentTime = '';
        this.isTimerRunning = false;
      }
    }, 1000);
  }

  public stopServiceTimer() {
    console.log('Stoping timer ');
    clearInterval(this.x);
    this.currentTime = '';
    this.isTimerRunning = false;
  }

  public getTime() {
    if (this.currentTime === '02:01' || this.currentTime === '02:02') {
      this.currentTime = '02:00';
    }
    return this.currentTime;
  }
}
