import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

declare var window;
declare var navigator;
declare var Connection;
declare var CryptoJS;

@Injectable()
export class UtilService {

  customDatePickerObservable = new Subject();
  busyindicatorObservable = new Subject();

  strongRegularExp = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,})'
  );
  mediumRegularExp = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  );
  smallAplhaRegex = /[a-z]/;
  capitalAplhaRegex = /[A-Z]/;
  numberRegex = /[0-9]/;
  onlyNumberRegex = /[0-9]/;
  // specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]/; // Initial used Regex
  specialRegex = /[!@#$%^&*_\-\\|.\/]/; // Changed Regex as suggested

  // Platforms
  DESKTOP = 1;
  MOBILE = 2;
  TABLET = 3;

  // Envirnments
  ANDROID = 1;
  IOS = 2;

  networkState: boolean;
  isNetworkDown: boolean;

  constructor() {
    this.networkState = false;
    this.isNetworkDown = false;
  }

  checkStrength(value) {
    // console.log('UtilService > checkStrength > ' + value);
    if (this.strongRegularExp.test(value)) {
      return 'Strong';
    } else if (this.mediumRegularExp.test(value)) {
      return 'Medium';
    } else {
      if (value !== '') {
        return 'Weak';
      } else {
        return '';
      }
    }
  }

  isSmallAlpha(value: string) {
    return this.smallAplhaRegex.test(value);
  }

  isCapitalAlpha(value: string) {
    return this.capitalAplhaRegex.test(value);
  }

  isNumberAlpha(value: string) {
    return this.numberRegex.test(value);
  }

  isNumeric(value: string) {
    return this.onlyNumberRegex.test(value);
  }
  isSpacialChar(value: string) {
    return this.specialRegex.test(value);
  }

  isDesktop() {
    if ( navigator.userAgent.match(/(ipad|iPhone|Android|iPad)/) === null || document.URL.substring(0, 4) === 'http' ) {
      return true;
    } else {
      return false;
    }
  }

  isEmptyString(stringName) {
    if (
      stringName === null ||
      stringName === '' ||
      stringName === undefined ||
      stringName.toString().trim() === '' ||
      stringName.toString().toUpperCase() === 'NONE'
    ) {
      return true;
    } else {
      return false;
    }
  }

  formatDatePickerData(data, DEVICE_MODEL, DEVICE_PLATFORM) {
    const dataNumeric: any = Number(data);
    let dateInput: any = new Date(dataNumeric);
    if (DEVICE_MODEL === this.MOBILE || DEVICE_MODEL === this.TABLET) {
      if (DEVICE_PLATFORM === this.ANDROID) {
        dateInput = new Date(data);
      }
    }
    let month: any = dateInput.getMonth() + 1;
    let day: any = dateInput.getDate();
    const year = dateInput.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }
    dateInput = day + '-' + month + '-' + year;
    return dateInput;
  }

  showDatePicker(
    currentDate,
    mode,
    success,
    error,
    allowFutureDt,
    DEVICE_MODEL,
    DEVICE_PLATFORM
  ) {
    // debugger;
    let date;

    if (currentDate === undefined) {
      date = new Date();
    } else {
      date = new Date(currentDate);
    }

    if (allowFutureDt !== undefined && allowFutureDt === false) {
      allowFutureDt = false;
    } else {
      allowFutureDt = true;
    }

    if (DEVICE_MODEL === this.MOBILE || DEVICE_MODEL === this.TABLET) {
      // Mobile flow
      if (DEVICE_PLATFORM === this.ANDROID) {
        // Android flow
        window.plugins.DatePickerPlugin.show(
          {
            date: date,
            mode: mode, // date or time or blank for both
            allowFutureDates: allowFutureDt,
            maxYearLimit: 10
          },
          data => {
            success(
              this.formatDatePickerData(data, DEVICE_MODEL, DEVICE_PLATFORM)
            );
            return;
          },
          e => {
            error(e);
          }
        );
      } else {
        // IOS flow
        window.plugins.DatePicker.showPicker(
          {
            date: date,
            mode: mode, // date or time or blank for both
            allowFutureDates: allowFutureDt,
            maxYearLimit: 10
          },
          data => {
            success(
              this.formatDatePickerData(data, DEVICE_MODEL, DEVICE_PLATFORM)
            );
          },
          e => {
            error(e);
          }
        );
      }
    }
  }

  closeDatePicker(DEVICE_MODEL, DEVICE_PLATFORM) {
    if (DEVICE_MODEL === this.MOBILE || DEVICE_MODEL === this.TABLET) {
      if (DEVICE_PLATFORM === this.ANDROID) {
        window.plugins.DatePickerPlugin.callingDateTimeout();
      } else {
        window.plugins.DatePicker.closeDatePicker();
      }
    }
  }

  checkConnection(DEVICE_MODEL, DEVICE_PLATFORM) {
    this.networkState = navigator.connection.type;
    this.isNetworkDown = false;

    if (DEVICE_MODEL === this.MOBILE || DEVICE_MODEL === this.TABLET) {
      if (navigator.network) {
        const networkState = navigator.network.connection.type;
        if (DEVICE_PLATFORM === this.ANDROID) {
          if (networkState === Connection.NONE) {
            this.isNetworkDown = true;
          }
        } else {
          if (
            networkState === Connection.NONE ||
            networkState === Connection.UNKNOWN
          ) {
            this.isNetworkDown = true;
          }
        }
      }
    } else {
      if (navigator.onLine) {
        this.isNetworkDown = false;
      } else {
        this.isNetworkDown = true;
      }
    }
    return this.isNetworkDown;
  }

  encryptData(inputStr) {
    const key = CryptoJS.enc.Utf8.parse('DigitalServicing');
    const iv = CryptoJS.enc.Utf8.parse('DigitalServicing');

    let encryptedStr;
    if (!this.isEmptyString(inputStr)) {
      encryptedStr = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(inputStr),
        key,
        {
          keySize: 256 / 32,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      console.log('Encrypted text for ' + inputStr + ' : ' + encryptedStr);
      return '' + encryptedStr;
    } else {
      return '';
    }
  }

  decryptData(inputStr) {
    const key = CryptoJS.enc.Utf8.parse('DigitalServicing');
    const iv = CryptoJS.enc.Utf8.parse('DigitalServicing');
    if (!this.isEmptyString(inputStr)) {
      const decrypted = CryptoJS.AES.decrypt(inputStr, key, {
        keySize: 256 / 32,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Decrypted text : ' + decryptedText);
      return decryptedText;
    } else {
      return '';
    }
  }

  sms(number, message, DEVICE_MODEL, DEVICE_PLATFORM) {
    if (DEVICE_MODEL === this.MOBILE) {
      window.plugins.SMSComposer.sendSms(number, message);
    }
  }

  phone(phone, DEVICE_MODEL, DEVICE_PLATFORM) {
    if (DEVICE_MODEL === this.MOBILE) {
      if (DEVICE_PLATFORM === this.ANDROID) {
        window.location.href = 'tel:' + phone;
      } else {
        window.plugins.PhoneDialer.dial(phone);
      }
    }
  }

  email(recepient, subject, message, DEVICE_MODEL, DEVICE_PLATFORM) {
    if (DEVICE_MODEL === this.MOBILE) {
      if (DEVICE_PLATFORM === this.ANDROID) {
        window.plugins.EmailComposer.sendEmail(
          recepient,
          subject,
          message,
          function() {},
          function() {}
        );
      } else {
        // subject, body, toRecipients, ccRecipients, bccRecipients, bIsHTML, imageAttachments,imageNames
        window.plugins.EmailComposer.showEmailComposer(
          subject,
          message,
          recepient,
          '',
          '',
          true,
          '',
          ''
        );
      }
    }
  }

  openExternalBrowserWindow(URL, target) {
    if (target === 'blank') {
      window.open(URL, '_blank');
    } else if (target === 'self') {
      window.open(URL, '_self');
    }
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  showBusyIndicator() {
    this.busyindicatorObservable.next(true);
  }

  hideBusyIndicator() {
    this.busyindicatorObservable.next(false);
  }
}
