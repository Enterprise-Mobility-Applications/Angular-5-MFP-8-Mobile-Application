import { Component, OnInit } from '@angular/core';

import { CustomDialogService } from './../../../shared/services/custom-dialog.service';
import { NavigationService } from './../../../shared/services/navigation.service';
import { DataStoreService } from './../../../shared/services/data-store.service';
import { UtilService } from '../../../shared/services/util.service';
import { AppConfigService } from './../../../shared/services/app-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  dialogMessageforPopup = {};
  profileData;

  headerOptions;
  public messagesServiceLocal;
  btnText: string;
  userName;
  mobileNumber;
  email;
  aadharNumber;
  enrollmentNumber;
  PANNumber;
  proofName;
  proof;
  isProof: boolean;
  isAadhar: boolean;
  todaysDate;
  enrollmentDate;
  constructor(
    private customDialogService: CustomDialogService,
    private dataStore: DataStoreService,
    private utilService: UtilService,
    private navigationService: NavigationService,
    private appConfig: AppConfigService
  ) {
    this.messagesServiceLocal = appConfig.LANGUAGE;
    this.btnText = this.messagesServiceLocal.commonNextButton;
    appConfig.IS_LOGIN = false;
  }

  ngOnInit() {
    this.navigationService.setBackPage('dashboardHome');
    this.isAadhar = false;
    this.todaysDate = new Date();

    this.profileData = this.dataStore.getData('customerProfileDetails');
    this.userDetails();
    this.checkEnrollmentDate();
    this.headerOptions = {
      isAuthenticated: false,
      headerText: this.messagesServiceLocal.profileText,
      showLeftButton: true,
      showRightButton: false,
      rightButtonURL: '',
      rightButton: 0
    };

    if (!this.utilService.isEmptyString(this.aadharNumber)) {
      this.proofName = this.messagesServiceLocal.profileAadharNumber;
      this.proof = this.aadharNumber;
      this.isProof = true;
      this.isAadhar = true;
    } else if (!this.utilService.isEmptyString(this.enrollmentNumber)) {
      this.proofName = this.messagesServiceLocal.profileEnrollmentNumber;
      this.proof = this.enrollmentNumber;
      this.isProof = true;
      this.isAadhar = false;
    } else {
      this.proofName =
        this.messagesServiceLocal.profileAadharNumber +
        '/' +
        this.messagesServiceLocal.profileEnrollmentNumber;
      this.proof = '';
      this.isProof = false;
      this.isAadhar = false;
    }

    if ( this.profileData.hasOwnProperty('flow') ) {
      this.profileData['flow'] = '';
    }
  }

  userDetails() {
    if (
      this.profileData.aadhar === undefined ||
      this.profileData.aadhar === ''
    ) {
      this.dialogMessageforPopup = {
        title: this.messagesServiceLocal.aadharNotFoundErrorHeaderText,
        message: this.messagesServiceLocal.aadharNotFoundErrorBodyText,
        tips: '',
        button: [this.messagesServiceLocal.uploadAadhar],
        closeIcon: true
      };

      this.customDialogService.openDialog(
        this.dialogMessageforPopup,
        optionClicked => {
          if (optionClicked === this.messagesServiceLocal.uploadAadhar) {
            this.profileData['flow'] = 'Add-Aadhaar';
            this.dataStore.setData('customerProfileDetails', this.profileData);
            this.navigationService.navigateTo('selectAadharFlow');
          }
        }
      );
    }

    this.userName =
      this.profileData.firstName + ' ' + this.profileData.lastName;
    this.mobileNumber = this.profileData.mobile;
    this.email = this.profileData.email;
    this.aadharNumber = this.profileData.aadhar;
    this.enrollmentNumber = this.profileData.aadharEnrollment;
    this.PANNumber = this.profileData.PAN;
  }

  checkEnrollmentDate() {
    // this.enrollmentDate = this.profileData.aadharEnrollmentDate;
    this.enrollmentDate = '28/12/2017';
    this.enrollmentDate = this.enrollmentDate.replace(/[/-]/g, '');
    const enrollmentDay = this.enrollmentDate.substr(0, 2);
    const enrollmentMonth = this.enrollmentDate.substr(2, 2);
    const enrollmentYear = this.enrollmentDate.substr(4, 4);
    this.todaysDate = new Date();
    const todaysDay = this.todaysDate.getDate();
    const todaysMonth = this.todaysDate.getMonth() + 1;
    const todaysYear = this.todaysDate.getFullYear();

    if (todaysYear - 1 > enrollmentYear) {
      console.log('true');
      return true;
    } else if (todaysYear === enrollmentYear) {
      if (todaysMonth >= enrollmentMonth + 3) {
        if (todaysDay > enrollmentDay) {
          console.log('true');
          return true;
        } else {
          console.log('false');
          return false;
        }
      } else {
        console.log('true');
        return true;
      }
    } else if (todaysYear - 1 === enrollmentYear) {
      if (todaysMonth + 12 >= enrollmentMonth + 3) {
        if (todaysDay > enrollmentDay) {
          console.log('true');
          return true;
        } else {
          console.log('true');
          return false;
        }
      } else {
        console.log('true');
        return true;
      }
    }
  }

  addAadhar() {
    this.profileData['flow'] = 'Add-Aadhaar';
    this.dataStore.setData('customerProfileDetails', this.profileData);
    this.navigationService.navigateTo('aadharValidationType');
  }

  addAadharEnrollment() {
    this.profileData['flow'] = 'Add-Enrollment';
    this.dataStore.setData('customerProfileDetails', this.profileData);
    this.navigationService.navigateTo('selectAadharFlow');
  }

  editAadhar() {
    if (this.isProof && this.isAadhar) {
      this.dialogMessageforPopup = {
        title: 'Are you Sure?',
        message:
          'We Already have your Aadhar Number :' +
          this.profileData.aadhar +
          '. Do you want to change it?',
        tips: '',
        button: ['Yes'],
        closeIcon: true
      };

      this.customDialogService.openDialog(
        this.dialogMessageforPopup,
        optionClicked => {
          if (optionClicked === 'Yes') {
            this.profileData['flow'] = 'Edit-Aadhaar';
            this.dataStore.setData('customerProfileDetails', this.profileData);
            this.navigationService.navigateTo('/selectAadharFlow');
          }
        }
      );
    } else {
      this.dialogMessageforPopup = {
        title: 'Are you Sure?',
        message:
          'We Already have your Enrollment Number :' +
          this.enrollmentNumber +
          '. Do you want to change it?',
        tips: '',
        button: ['Yes'],
        closeIcon: true
      };

      this.customDialogService.openDialog(
        this.dialogMessageforPopup,
        optionClicked => {
          if (optionClicked === 'Yes') {
            this.profileData['flow'] = 'Edit-Enrollment';
            this.dataStore.setData('customerProfileDetails', this.profileData);
            this.navigationService.navigateTo('selectAadharFlow');
          }
        }
      );
    }
  }
}
