function SMSComposer(){};

SMSComposer.prototype.sendSms = function(number, message, successForSMS, failForSMS) {	
	cordova.exec(successForSMS, failForSMS, 'SMSComposer', 'showSMSComposer', new Array(number, message));
};

SMSComposer.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.SMSComposer = new SMSComposer();  
  return window.plugins.SMSComposer;
};

cordova.addConstructor(SMSComposer.install);
