import { Injectable } from '@angular/core';

import { UtilService } from './util.service';
import { AppConfigService } from './app-config.service';

declare var window;
declare var gtag;

@Injectable()

export class GoogleAnalyticsEventsService {

  constructor(private utilservice: UtilService,
  private appConfig: AppConfigService) {}

  public sendView(data) {
    if ( this.appConfig.DEVICE_MODEL === this.appConfig.MOBILE || this.appConfig.DEVICE_MODEL === this.appConfig.TABLET ) {
      // Case Mobile
      if (this.appConfig.isAnalyticsLoaded) {
        if (window.ga.trackView) {
          window.ga.trackView(data.page_title, data.page_location);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    } else if (this.appConfig.DEVICE_MODEL === this.appConfig.DESKTOP) {
      // Case Desktop
      if (this.appConfig.isAnalyticsLoaded) {
        if (gtag) {
          gtag('config', this.appConfig.MOBILE_ANALYTIC_ID, data);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    }
  }

  public sendClick(event, data) {
   if (this.appConfig.DEVICE_MODEL === this.appConfig.MOBILE || this.appConfig.DEVICE_MODEL === this.appConfig.TABLET) {
     // Case Mobile
      if (this.appConfig.isAnalyticsLoaded) {
        if (window.ga.trackEvent) {
          window.ga.trackEvent(data.event_category, data.event_action, data.event_label);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    } else if (this.appConfig.DEVICE_MODEL === this.appConfig.DESKTOP) {
      // Case Desktop
      if (this.appConfig.isAnalyticsLoaded) {
        if (gtag) {
          gtag('event', event, data);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    }
  }

  public sendTime(data) {
    if (this.appConfig.DEVICE_MODEL === this.appConfig.MOBILE || this.appConfig.DEVICE_MODEL === this.appConfig.TABLET) {
      // Case Mobile
      if (this.appConfig.isAnalyticsLoaded) {
        if (window.ga.trackTiming) {
          // where IntervalInMilliseconds is numeric
          window.ga.trackTiming(data.event_category, data.value, data.name);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    } else if (this.appConfig.DEVICE_MODEL === this.appConfig.DESKTOP) {
      // Case Desktop
      if (this.appConfig.isAnalyticsLoaded) {
        if (gtag) {
          gtag('event', 'timing_complete', data);
        } else {
          this.initializeAnalytics();
        }
      } else {
        this.initializeAnalytics();
      }
    }
  }

  initializeAnalytics() {
    if (this.appConfig.DEVICE_MODEL === this.appConfig.DESKTOP) {
      if (gtag) {
        gtag('config', this.appConfig.MOBILE_ANALYTIC_ID, { 'send_page_view': false } );
        this.appConfig.isAnalyticsLoaded = true;

        /************** View ****************/
        // let pageTrackingData = {
        //   'page_title': 'Customer_Registration_Page',
        //   'page_location': 'http://foo.com/customer_registration',
        //   'page_path': '/customer_registration'
        // };

        // this.googleAnalytics.sendView(pageTrackingData);

        /************** Time ****************/
        // let timeTrackingData = {
        //   'name': 'Customer_Registration',
        //   'value': 50000,
        //   'event_category': 'Time_Spent'
        // };

        // this.googleAnalytics.sendTime(timeTrackingData);

      /************** Event ****************/
      // let eventName = 'Customer_Registration';
      // let eventTrackingData = {
      //   'event_category': 'Registration_Type', // Visible at first colunm - Event Category in console.
      //   'event_action' : 'Registration',
      //   'event_label': 'Policy_No'
      // };

      // this.googleAnalytics.sendClick(eventName, eventTrackingData);
      }
    } else if (this.appConfig.DEVICE_MODEL === this.appConfig.MOBILE || this.appConfig.DEVICE_MODEL === this.appConfig.TABLET) {
      if (window.ga) {
        window.ga.startTrackerWithId(
          this.appConfig.MOBILE_ANALYTIC_ID,
          success => {
            console.log('Analytics enabled for mobile');
            this.appConfig.isAnalyticsLoaded = true;
          },
          failure => {
            console.log('Error in enabling startTrackerWithId for mobile');
            this.appConfig.isAnalyticsLoaded = false;
          }
        );
      }
    }
  }

}
