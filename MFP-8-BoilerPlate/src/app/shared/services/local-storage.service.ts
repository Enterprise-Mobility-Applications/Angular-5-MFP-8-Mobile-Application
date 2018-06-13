import { Injectable, Inject } from '@angular/core';
import { AppConfigService } from './app-config.service';

declare var WL;

@Injectable()
export class LocalStorageService {
  constructor(private appConfig: AppConfigService) {}

  successCallBack;
  // collectionName = 'userCollection';
  collections = {
    userCollection: {
      // Object that defines the Search Fields for the 'people' collection.
      searchFields: { userId: 'string', userType: 'string', loginType : 'string'}
    },
    rateAppCollection: {
      searchFields: {
        option: 'string',
        onDate: 'string',
        logoutCount: 'number',
        alertDate: 'string'
      }
    }
  };

  // Optional options object.
  options = {
    // Optional username, default 'jsonstore'.
    username: 'admin',
    // Optional password, default no password.
    password: 'admin123',
    // Optional local key generation flag, default false.
    localKeyGen: false
  };

  filterOptions = {
    // Returns a maximum of 10 documents, default no limit.
    limit: 10,
    // Skip 0 documents, default no offset.
    offset: 0,
    // Search fields to return, default: ['_id', 'json'].
    filter: ['_id', 'json']
  };

  getData(collectionName, isMobileEnvironment, callBack) {
    // console.log('GetData called for > ' + collectionName);
    if ( isMobileEnvironment === this.appConfig.MOBILE || isMobileEnvironment === this.appConfig.TABLET ) {
      if (WL) {
        WL.JSONStore.init(this.collections, this.options)
        .then(() => {
          WL.JSONStore.get(collectionName)
            .findAll(this.filterOptions)
            .then(findResult => {
              // console.log('GetData > findResult : ' + JSON.stringify(findResult) + ' length: ' + findResult.length);
              if (findResult.length > 0) {
                // console.log('Rrturning the data : ' + JSON.stringify(findResult[0].json));
                callBack(findResult[0].json);
              } else {
                // console.log('Returning the blank data :');
                callBack();
              }
            })
            .fail(() => {
              // console.log('findAll - failed');
            });
        })
        .fail(() => {
          // console.log('Init - failed');
        });
      }
    } else if (isMobileEnvironment === this.appConfig.DESKTOP) {
      const findResult = localStorage.getItem(collectionName);
      if (findResult != null || findResult !== '') {
        callBack(JSON.parse(findResult));
      } else {
        // console.log('web Returning the blank data :');
        callBack();
      }
    }
  }

  setData(collection, data, isMobileEnvironment, callBack) {
    this.successCallBack = callBack;

    if ( isMobileEnvironment === this.appConfig.MOBILE || isMobileEnvironment === this.appConfig.TABLET  ) {
      if (WL) {
        WL.JSONStore.init(this.collections, this.options)
        .then(success => {
          // WL.JSONStore.get(collection).find(query, this.filterOptions)
          WL.JSONStore.get(collection)
            .findAll(this.filterOptions)
            .then(findResult => {
              // console.log('SetData > findResult : ' + JSON.stringify(findResult) + ' length: ' + findResult.length);
              if (findResult.length === 0) {
                // Add new document in collection
                const tempData = data;
                this.addToCollection(collection, tempData);
              } else {
                // Replace or modify the document
                const replaceData = {
                  _id: findResult[0]._id,
                  json: data
                };
                // console.log('Details needs to be update: ' + JSON.stringify(replaceData));
                this.replaceToCollection(collection, replaceData);
              }
            })
            .fail(() => {
              // console.log('findResult - failed');
            });
        })
        .fail(() => {
          this.destroyAllCollections();
        });
      }
    } else {
      // console.log('web setItem the data ' );
      localStorage.setItem(collection, JSON.stringify(data));
      callBack('success');
    }
  }

  addToCollection(collection, data) {
    // console.log('addToCollection > Details needs to be update: ' + JSON.stringify(data));
    const addOptions = {
      // Mark data as dirty (true = yes, false = no), default true.
      markDirty: true
    };
    if (WL) {
      WL.JSONStore.get(collection)
      .add(data, addOptions)
      .then(numberOfDocumentsAdded => {
        // console.log('Document added in collection : ' + numberOfDocumentsAdded);
        this.successCallBack(true);
      })
      .fail(errorObject => {
        // console.log('addToCollection - failed');
      });
    }
  }

  replaceToCollection(collection, replaceWith) {
    if (WL) {
      WL.JSONStore.get(collection)
      .replace(replaceWith)
      .then(numberOfDocsReplaced => {
        // console.log('Document replaced in collection : ' + numberOfDocsReplaced);
        this.successCallBack(true);
      })
      .fail(error => {
        // console.log('Document replaced - failed');
      });
    }
  }

  destroyAllCollections() {
    if (WL) {
      WL.JSONStore.destroy()
      .then(() => {
        // console.log('destroyed');
      })
      .fail(errorObject => {
        // console.log('destroy - failed');
      });
    }
  }
}
