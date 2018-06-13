import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable()
export class NavigationService {

  constructor(private _router: Router,
  private _location: Location,
  private zone: NgZone) {}

/*
* Navigation stack and stack manipulation functions
*/

  _stack = [];
  _backPage;

  setBackPage = function(targetPage){
    this._backPage = targetPage;
    console.log('Setting _backPage: ' + this._backPage);
    document.addEventListener('backbutton', () => {
        console.log('In Backbutton event - _backPage is : ' + this._backPage);
        if (this._backPage !== '') {
          this.zone.run(() => this.navigateToURL(this._backPage));
        }
        return false;
    }, false);
  };

  push = function(url) {
    this._stack.push(url);
  };

  pop = function() {
    return this._stack.pop();
  };

  reset = function() {
    this._stack = [];
  };

  popToRoot = function() {
    const rootPage = this._stack[0];
    this.reset();
    return rootPage;
  };

  // getArray = function() {
  //     return this._stack;
  // };

  /*
  * Navigate to given path
  */
  routeTo = function(route) {
    console.log('Navigation Stack: ' + this._stack);
    this._router.navigate(['/' + route]);
    // $location.path(route);
    // if (!$rootScope.$$phase) {
    //  $rootScope.$apply();
    // }
  };

  /*
  * Function to fetch current path
  */
  getCurrentLocation = function() {
    return this._location.path();
  };

  /*
  * Function to Navigate and
  * push previous page in stack
  */
  navigateTo = function(route) {
    // Pushing previous page to stack
    this.push(this.getCurrentLocation());
    // Routing to provided route
    this.routeTo(route);
  };

  /*
  * Function to Navigate Back one page and
  * pop action will be preformed
  */
  navigateBack = function(step) {
    // Routing to provided route
    if (step != null) {
      let stepInt = parseInt(step);
      while (!isNaN(stepInt) && stepInt > 1) {
        this.pop();
        stepInt--;
      }
    }

    if (this._stack.length > 0) {
      this.routeTo(this.pop());
    }

  };

  /*
  * Function to Navigate to root page
  * This will clear stack
  */
  navigateToRoot = function() {
    // Routing to provided route
    this.routeTo(this.popToRoot());
  };

  /*
  * Function to Start new flow
  * Navigation will be done to route provided
  * and previous stack will be cleared
  */
  startNewFlow = function(route) {
    // Reset Navigation Stack
    this.reset();
    // Routing to provided route
    this.routeTo(route);
  };

  /*
  * Function to navigate to new page
  * without pushing current page in stack
  */
  navigateKeepNoHistory = function(route) {
    // Routing to provided route
    this.routeTo(route);
  };

  /*
  * Function to Navigate particular to page
  *
  */
  navigateToURL = function(url) {
    this._stack.splice(this._stack.indexOf(url), (this._stack.length - 1));
    this.routeTo(url);
  };

  /*
  * Reset stack and keep first item
  */
  resetStackToRoot = function(url) {
    const rootPage = this._stack[0];
    this.reset();
    this.push(rootPage);
  };

}
