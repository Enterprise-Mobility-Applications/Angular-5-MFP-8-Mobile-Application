var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
  'mfpContextRoot' : '/mfp',
  'applicationId' : 'com.metlife.digitalservicing'
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
  console.log('-------------------- MobileFirstPlatform initialized Mobile --------------------');
  var event = new Event('mfpReady');
  document.dispatchEvent(event);
}
