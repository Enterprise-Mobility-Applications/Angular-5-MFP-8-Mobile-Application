function PhoneDialer(){};

PhoneDialer.prototype.dial = function(phnum) {    
    cordova.exec(null, null, "PhoneDialer", "dialPhone", [{"number":phnum}]);
};

PhoneDialer.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.PhoneDialer = new PhoneDialer();  
  return window.plugins.PhoneDialer;
};

cordova.addConstructor(PhoneDialer.install);
