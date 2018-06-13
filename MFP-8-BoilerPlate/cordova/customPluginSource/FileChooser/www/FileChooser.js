// var exec = require('cordova/exec');

// exports.coolMethod = function (arg0, success, error) {
//     exec(success, error, 'FileChooser', 'coolMethod', [arg0]);
// };

var FileChooser = function() {};

FileChooser.prototype.open = function(sucessCallback, failureCallback) {
  cordova.exec(sucessCallback, failureCallback, "FileChooser", "open", []);
};

FileChooser.install = function() {
  if (!window.plugins) {
    window.plugins = {};
  }
  window.plugins.FileChooser = new FileChooser();
  return window.plugins.FileChooser;
};

cordova.addConstructor(FileChooser.install);
