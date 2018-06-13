import { Injectable } from '@angular/core';

import { DataStoreService } from './data-store.service';
import { MockDataService } from './mock-data.service';
import { AppConfigService } from './app-config.service';
import { CustomDialogService } from './custom-dialog.service';
import { UtilService } from './util.service';

declare var WLResourceRequest;

@Injectable()
export class AdapterService {
  private resourceRequest;
  private response;
  private isNetworkDown: boolean;

  dialogMessage = {
    title: 'Error',
    message: 'Do you want to save changes you made to document before closing?',
    tips: 'If you don`t save, your changes will be lost.',
    button: ['Ok', 'Close']
  };

  constructor(
    private dataStoreService: DataStoreService,
    private mockDataService: MockDataService,
    private appConfigService: AppConfigService,
    private customDialogService: CustomDialogService,
    private utilService: UtilService
  ) {
    this.isNetworkDown = false;
  }

  callProcedure(adapterName, inputparams, successCallback, faliurCallback) {
    if (this.appConfigService.IS_OFFLINE) {
      this.response = this.mockDataService.response[adapterName];
      if (this.response) {
        if (this.response.hasOwnProperty('responseCode')) {
          successCallback(this.response);
        } else {
          // Call the Error Popup
          this.customDialogService.openDialog(
            this.dialogMessage,
            optionClicked => {}
          );
        }
      } else {
        // Call the Error Popup
        this.customDialogService.openDialog(
          this.dialogMessage,
          optionClicked => {}
        );
      }
    } else {
      this.isNetworkDown = this.utilService.checkConnection(
        this.appConfigService.DEVICE_MODEL,
        this.appConfigService.DEVICE_PLATFORM
      );

      if (!this.isNetworkDown) {

        this.utilService.showBusyIndicator();

        this.resourceRequest = new WLResourceRequest(
          adapterName,
          WLResourceRequest.POST,
          this.appConfigService.ADAPTER_TIMEOUT
        );

        const formParams = {"params":"['" + JSON.stringify(inputparams) + "']"};

        console.log( 'Serview : ' + adapterName + '\nParams : ' + JSON.stringify(formParams) );

        this.resourceRequest.sendFormParameters(formParams).then(
          function(response) {
            console.log(
              'callProcedure > Adapter > response : ' + JSON.stringify(response)
            );
            if (response) {
              if (response.hasOwnProperty('responseJSON')) {
                successCallback(response.responseJSON);
              } else {
                // Call the Error Popup
                this.customDialogService.openDialog(
                  this.dialogMessage,
                  optionClicked => {}
                );
              }
            } else {
              // Call the Error Popup
              this.customDialogService.openDialog(
                this.dialogMessage,
                optionClicked => {}
              );
            }
          },
          function(error) {
            console.log( 'callProcedure > Adapter > error : ' + JSON.stringify(error) );
            faliurCallback(error);
          }
        );
      } else {
        // Network error popup
        this.dialogMessage = {
          title: 'Internet Connection error',
          message:
            'Your device’s Internet connection isn’t working. Check your connection and try again.',
          tips: '',
          button: ['RETRY']
        };

        this.customDialogService.openDialog(
          this.dialogMessage,
          optionClicked => {}
        );
      }
    }
  }
}
