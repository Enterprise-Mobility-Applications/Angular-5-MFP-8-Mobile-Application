import { Injectable, enableProdMode } from '@angular/core';

import { UtilService } from './util.service';
import { NavigationService } from './navigation.service';
import { MessagesService } from './messages.service';

declare var device;
@Injectable()
export class AppConfigService {
  otp_user_block_timer: number;
  LANGUAGE;
  APP_URLS;
  otpButtonText: string;
  resendbuttoncounter = 0;
  regeneratebuttoncounter: number;
  isRegenerateDisabled: boolean;
  IS_LOGIN: boolean;
  IS_LOGIN_FOOTER: boolean;
  IS_OTP: boolean;
  IS_APP: boolean;
  IS_MOBILEWEB: boolean;
  isAuthenticated: boolean;
  STARTTIMESTAMP;
  ENDTIMESTAMP;
  APP_VERSION = '1.0.0';
  IS_OFFLINE = true;
  ADAPTER_TIMEOUT = 30000;
  ISWLCONNECTED: boolean;
  isAnalyticsLoaded: boolean;
  MOBILE_ANALYTIC_ID = 'UA-107618560-3';
  DISABLECONSOLELOG = false;
  app = document.URL.indexOf('http://') === -1 &&
    document.URL.indexOf('https://') === -1;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  IS_USER_BLOCKED: boolean;

  IMAGE_PAYLOAD_SIZE: number;

  // For regisrtation details
  verifyLimitCount = 0;

  // Platforms
  DESKTOP = 1;
  MOBILE = 2;
  TABLET = 3;

  // Google Analytics Click Counter
  registerByPolicyCounter = 0;
  editPolicyCounter = 0;
  registerByMobileCounter = 0;
  regprevValue;

  // Environments
  ANDROID = 1;
  IOS = 2;

  DEVICE_MODEL: number; // DEVICEMODEL returns the name of the device's model or product.
  DEVICE_PLATFORM: number; // DEVICE_PLATFORM returns the device's operating system name. (For Mobile only)

  otpTimer = 120;
  regenerateTimer = 600;

  adapters = {
    registration: {
      generateOTP: '/adapters/communicationAdapter/generateOtp',
      validateOTP: '/adapters/communicationAdapter/validateotp',
      resendOTP: '/adapters/communicationAdapter/resendotp',
      regenerateOTP: '/adapters/communicationAdapter/regenerateotp',
      validateCustomerData: '/adapters/registrationAdapter/validateCustomerData',
      accountCreation: '/adapters/registrationAdapter/saveCustomer'
    },
    login: {
      validateSalesUser: '/adapters/authenticationAdapter/validateSalesUser',
      validateEmployee: '/adapters/authenticationAdapter/validateEmployee',
      validateUser: '/adapters/userLoginAdapter/validateUser',
      logout: '/adapters/userLoginAdapter/logout'
    },
    aadharUpdate: {
      generateAadharOTP: '/adapters/aadharUpdate/generateAadharOTP',
      uploadAadharImage: '/adapters/aadharUpdate/uploadAadharImage'
    },
    validateAadhar: {
      validateAadharOTP: '/adapters/validateAadhar/validateAadharOTP',
    },
    aadharConfirmation: {
      verifyDetials: '/adapters/aadharConfirmation/verifyDetials',
    }
  };

  messages = {
    resendOtp: 'RESEND OTP',
    regenerateOtp: 'REGENERATE OTP'
  };

  constructor(
    private utilService: UtilService,
    private navigationService: NavigationService,
    private commonMessagesService: MessagesService
  ) {
    this.otp_user_block_timer = 2; // This needs to be 15 min
    this.IMAGE_PAYLOAD_SIZE = 5000000; // Bites

    this.isAuthenticated = false;
    this.otpButtonText = 'RESEND OTP';
    this.regeneratebuttoncounter = 0;
    this.isRegenerateDisabled = false;
    this.ISWLCONNECTED = false;
    this.isAnalyticsLoaded = false;
    this.IS_USER_BLOCKED = false;

    this.LANGUAGE = this.commonMessagesService.EN;
    this.APP_URLS = this.commonMessagesService.URLS;
    this.IS_LOGIN = false;
    this.IS_LOGIN_FOOTER = false;
    this.IS_OTP = false;
    if (this.DISABLECONSOLELOG === true) {
      console.log('--------------- Disabling Console log ----------------');
      console.log = function() {};
    }
    // To detect browser is desktop or mobile browser
    if (this.isMobile) {
      this.IS_MOBILEWEB = true;
    } else {
      this.IS_MOBILEWEB = false;
    }
    // To detect mobile App
    if (this.app) {
      this.IS_APP = true;
    } else {
      this.IS_APP = false;
    }

    if (this.utilService.isDesktop()) {
      console.log('--------------- Device is DESKTOP ----------------');
      this.DEVICE_MODEL = this.DESKTOP;
    } else {
      let mobHeight: any;
      mobHeight = window.screen.width;
      console.log('Width : ' + mobHeight);

      if (mobHeight >= 768) {
        console.log('--------------- Device is TABLET ----------------');

        this.DEVICE_MODEL = this.TABLET;
      } else {
        console.log('--------------- Device is MOBILE ----------------');
        this.DEVICE_MODEL = this.MOBILE;
      }

      if (device.platform === 'Android') {
        this.DEVICE_PLATFORM = this.ANDROID;
      } else if (device.platform === 'iOS') {
        this.DEVICE_PLATFORM = this.IOS;
      }
    }
  }
}
