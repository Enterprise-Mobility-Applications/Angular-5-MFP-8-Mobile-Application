import { Injectable } from '@angular/core';

@Injectable()
export class MockDataService {
  response = {
    // registrationAdapter Responce
    '/adapters/registrationAdapter/validateCustomerData': {
      responseCode: '0',
      responseMessage: 'Success',
      data: [
        {
          'aadharNo': null,
          'policyNo': '20504200',
          'pan': 'CBKPS6405C',
          'transactionId': 'TRAN25027220050729',
          'clientID': '25027220',
          'mobile': '9434192695',
          'emailID': 'anirbitsarkar@yahoo.com'
        }
      ]
    },
    '/adapters/communicationAdapter/generateOtp': {
      responseCode: '0',
      responseMessage: 'Success',
      data: {
        transactionId: 'TRANS12345678912'
      }
    },
    '/adapters/communicationAdapter/validateotp': {
      responseCode: '0',
      responseMessage: 'Success',
      data: {
        resendAttempts: 1,
        validateAttempts: 1,
        regenerateAttempts: 1
      }
    },
    '/adapters/communicationAdapter/resendotp': {
      responseCode: '0',
      responseMessage: 'Success',
      data: {
        resendAttempts: 1,
        validateAttempts: 1,
        regenerateAttempts: 1
      }
    },
    '/adapters/communicationAdapter/regenerateotp': {
      responseCode: '0',
      responseMessage: 'Success',
      data: {
        resendAttempts: 1,
        validateAttempts: 1,
        regenerateAttempts: 1
      }
    },
    '/adapters/registrationAdapter/saveCustomer': {
      responseCode: '0',
      responseMessage: 'Success'
    },

    // authenticationAdapter Responce
    '/adapters/userLoginAdapter/validateUser': {
      responseCode: '0',
      responseMessage: 'C Success',
      profileData: {
        clientId: '88888888',
        firstName: 'Tanay',
        middleName: '',
        lastName: 'Kumar',
        gender: 'Male',
        dob: '1970',
        email: 'abc@xyz.com',
        mobile: '9999999999',
        PAN: 'AGKPC77777',
        aadhar: '435345345341',
        aadharEnrollment: '12345678901234',
        aadharEnrollmentDate: '02-01-2018',
        address: {
          address1: 'PQR',
          address2: 'LMN',
          address3: 'EFG',
          city: 'Mumbai',
          state: 'MH'
        }
      }
    },

    '/adapters/authenticationAdapter/logout': {
      responseCode: '0',
      responseMessage: 'Success'
    },

    '/adapters/authenticationAdapter/validateEmployee': {
      responseCode: '0',
      responseMessage: 'E Success'
    },

    '/adapters/authenticationAdapter/validateSalesUser': {
      responseCode: '0',
      responseMessage: 'A Success'
    },

    '/adapters/aadharUpdate/generateAadharOTP': {
      responseCode: '0',
      responseMessage: 'A Success',
      data: {
        token: 'ABCDEFGH'
      }
    },

    // Upload image success
    '/adapters/aadharUpdate/uploadAadharImage': {
      responseCode: '0',
      responseMessage: 'Success',
      data: {
        isRealTime: true,
        ticketID : '12341234',
      }
    },

    '/adapters/validateAadhar/validateAadharOTP': {
      // 'responseCode': '0',
      // 'responseMessage': 'Success',
      // 'data': {
      //   'isvalidated': 'Y',
      //   'aadharno': '525847555497',
      //   'txn': 'UKC:STGPNBML01:20180129044027716',
      //   'name': 'ABC PQR',
      //   'dob': '05-07-1981',
      //   'gender': 'M',
      //   'phonenum': '9986458623',
      //   'email': 'abc@pqr.com',
      //   'streetname': 'abc',
      //   'landmark': 'pqr',
      //   'locality': 'xyz',
      //   'district': 'aaa',
      //   'subdistrict': 'Raigad',
      //   'state': 'Maharashtra',
      //   'pincode': '400701',
      //   'photo': '[B@112c172',
      //   'eKYC-PDF ': 'Random text'
      // }
      responseCode: '0',
      responseMessage: 'A Success',
      data: {
        // aadhaar:'',
        // application: '',
        residentname: 'Tanay Kumar',
        gender: 'Male',
        //  dob: '23/45/1970',
        dob: '1970',
        address: {
          housenum: 'Plot No -6,',
          streetname: 'Harshwardhan soc. N-6,',
          landmark: null,
          locality: 'M-sector,',
          postoffice: 'Cidco',
          district: 'Near Church,',
          subdistrict: 'Aurangabad',
          state: 'Maharashtra,',
          pincode: '752110',
        }
      }
    },

    '/adapters/aadharConfirmation/verifyDetials': {
      responseCode: '0',
      responseMessage: 'A Success',
      data: {
        ticketNumber: '12341234' // if updation of aadhar number is in queue
      }
    },
    '/adapters/validateAdvisor/verifyDetials': {
      'responseCode': '0',
        'responseMessage': 'OTP sent successfully',
        'data': [ {
          'clientID': '12345678',
          'mobile': '9825656325',
          'email': 'xxx@gmail.com',
          'aadharNo': '982065635542',
          'policyNo': '12345678',
          'pan': 'AELPT9856E',
          'transactionId': 'TRANS123456780856'
        } ],
     }
  };

  constructor() {}
}
