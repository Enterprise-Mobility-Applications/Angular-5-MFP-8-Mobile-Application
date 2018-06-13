import { Injectable } from '@angular/core';

@Injectable()
export class DataStoreService {
  _data;

  constructor() {
    this._data = {};
  }

  getData = function(key) {
    if (this._data[key] !== undefined) {
        return this._data[key];
    } else {
        // Initialized the data to empty objects
        // this may be important if getData is called before setData
      return {};
    }
  };

  setData = function(key, value) {
    this._data[key] = value;
  };

  clearData = function(key) {
    if (this._data[key] !== undefined) {
        delete this._data[key];
    }
  };

  clearAllData = function() {
    this._data = {};
  };

}
