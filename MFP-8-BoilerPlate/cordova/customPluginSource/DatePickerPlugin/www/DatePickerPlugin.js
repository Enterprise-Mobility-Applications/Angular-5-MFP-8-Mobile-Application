function DatePickerPlugin() {};		

			DatePickerPlugin.prototype.show = function(options, sucessCallback, failureCallback) {
			
				if (options.date) {
					options.date = (options.date.getMonth() + 1) + "/" + (options.date.getDate()) + "/" + (options.date.getFullYear()) + "/"
							+ (options.date.getHours()) + "/" + (options.date.getMinutes());
				}
				var defaults = {
					mode : '',
					date : '',
					allowOldDates : true
				};
		
				for ( var key in defaults) {
					if (typeof options[key] !== "undefined")
						defaults[key] = options[key];
				}
				cordova.exec(sucessCallback, failureCallback, 'DatePickerPlugin', defaults.mode, new Array(defaults));
			};
			
			
			
			DatePickerPlugin.prototype.callingDateTimeout = function() {
				var defaults = {
						mode : '',
						date : '',
						allowOldDates : ''
					};
				cordova.exec(null, null, 'DatePickerPlugin', 'dismissDialogBoxes', new Array(defaults));
			};
			
DatePickerPlugin.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.DatePickerPlugin = new DatePickerPlugin();  
  return window.plugins.DatePickerPlugin;
};

cordova.addConstructor(DatePickerPlugin.install);
			