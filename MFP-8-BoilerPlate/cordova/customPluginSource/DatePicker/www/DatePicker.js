function DatePicker(){};

DatePicker.prototype.showPicker = function(options, sucessCallback, failureCallback, allowfuturedate) {
				var padDate = function(date) {
					if (date.length == 1) {
						return ("0" + date);
					}
					return date;
				};
				if (options.date) {
					options.date = options.date.getFullYear() + "-"
							+ padDate(options.date.getMonth() + 1) + "-"
							+ padDate(options.date.getDate()) + "T"
							+ padDate(options.date.getHours()) + ":"
							+ padDate(options.date.getMinutes()) + ":00Z";
				}
                var isfutureDate = true; 
                if(allowfuturedate != undefined && allowfuturedate == false){
                    isfutureDate = false; 
                }
				var defaults = {
					mode : 'datetime',
					date : '',
					allowFutureDates : isfutureDate
				};
				for ( var key in defaults) {
					if (typeof options[key] !== "undefined")
						defaults[key] = options[key];
				}
	
				cordova.exec(sucessCallback, failureCallback, "DatePicker",	"show", [ defaults ]);
			};
			
			
DatePicker.prototype.closeDatePicker = function() {
				cordova.exec(null, null, "DatePicker","closeDatePicker", [""]);
			};
		
DatePicker.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.DatePicker = new DatePicker();  
  return window.plugins.DatePicker;
};

cordova.addConstructor(DatePicker.install);