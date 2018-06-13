import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CustomDialogService {
  popupChangeObservable: Observable<any>;
  popupChangeObserver;
  handleCallBack: Function;

  customDialogPopup = new Subject();

  constructor() {
    // Custom popup Observable
    this.popupChangeObservable = new Observable(
      (observer: Observer<any>) => {
        this.popupChangeObserver = observer;
      }
    );
  }

  openDialog(data: any, callBack: Function) {
    this.handleCallBack = callBack;
    data['isOpen'] = true;
    this.popupChangeObserver.next(data);
  }

  closeDialog(optionClicked) {
    // const data = { 'isOpen': false };
    this.handleCallBack(optionClicked);
  }
}
