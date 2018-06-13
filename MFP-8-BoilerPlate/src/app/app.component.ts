import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppConfigService } from './shared/services/app-config.service';
import { GoogleAnalyticsEventsService } from './shared/services/google-analytics-events.service';
import { UtilService } from './shared/services/util.service';

declare var window;
declare var device;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private appConfig: AppConfigService,
    private router: Router,
    private googleanalytics: GoogleAnalyticsEventsService,
    private utilService: UtilService
  ) {  }

  ngOnInit() {
    if (this.appConfig.DEVICE_MODEL === this.appConfig.DESKTOP) {
      this.googleanalytics.initializeAnalytics();
    }

    document.addEventListener(
      'mfpReady',
      () => {
        this.appConfig.ISWLCONNECTED = true;
      },
      false
    );

    document.addEventListener(
      'deviceready',
      () => {
        // Now safe to use device
        if (
          !this.utilService.isEmptyString(window.ga) &&
          !this.utilService.isEmptyString(window.ga.startTrackerWithId) &&
          !this.utilService.isEmptyString(window.ga.trackEvent) &&
          !this.utilService.isEmptyString(window.ga.trackView)
        ) {
          this.googleanalytics.initializeAnalytics();
        }
      },
      false
    );
  }



}
