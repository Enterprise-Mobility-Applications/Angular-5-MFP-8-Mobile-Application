var FileManager = function() {};

FileManager.prototype.saveFile = function(
  sucessCallback,
  failureCallback,
  args
) {
  cordova.exec(sucessCallback, failureCallback, "FileManager", "save", args);
};

FileManager.prototype.saveOpenFile = function(
  sucessCallback,
  failureCallback,
  args
) {
  cordova.exec(
    sucessCallback,
    failureCallback,
    "FileManager",
    "saveOpen",
    args
  );
};

FileManager.prototype.openFile = function(
  sucessCallback,
  failureCallback,
  args
) {
  cordova.exec(sucessCallback, failureCallback, "FileManager", "open", args);
};

FileManager.prototype.downloadFile = function(
  sucessCallback,
  failureCallback,
  args
) {
  cordova.exec(
    sucessCallback,
    failureCallback,
    "FileManager",
    "download",
    args
  );
};

FileManager.prototype.deleteSavedFile = function(
  sucessCallback,
  failureCallback
) {
  if (!sucessCallback) {
    sucessCallback = function(data) {
      console.log("deleteFile.js > Success res:" + data);
    };
  }
  if (!failureCallback) {
    failureCallback = function(error) {
      console.log("deleteFile.js > Err: " + error);
    };
  }
  cordova.exec(sucessCallback, failureCallback, "FileManager", "delete", []);
};

FileManager.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.FileManager = new FileManager();
  return window.plugins.FileManager;
};

cordova.addConstructor(FileManager.install);
