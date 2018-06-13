
function EmailComposer(){};

EmailComposer.prototype.showEmailComposer = function(subject, body, toRecipients, ccRecipients, bccRecipients, bIsHTML, imageAttachments,imageNames) {     
    var args = {};
			if (toRecipients)
				args.toRecipients = toRecipients;
			if (ccRecipients)
				args.ccRecipients = ccRecipients;
			if (bccRecipients)
				args.bccRecipients = bccRecipients;
			if (subject)
				args.subject = subject;
			if (body)
				args.body = body;
			if (bIsHTML)
				args.bIsHTML = bIsHTML;
			if (imageAttachments)
				args.imageAttachments = imageAttachments;	
			if (imageNames)
				args.imageNames = imageNames;
			cordova.exec(null, null, "EmailComposer","showEmailComposer", [args]);
};

EmailComposer.prototype.sendEmail = function(toAddress, subject,emailContent, success, fail) {
    cordova.exec(success, fail, "EmailComposer","startActivityForFilePhysicalPath", [{
        action :"android.intent.action.SEND",
        path : '',
        type : 'text/plain',
        subject : subject,
        text : emailContent,	    			 	
        to :  toAddress,
    }]);	
};

EmailComposer.prototype.sendNonEnglishEmail = function(params, success, fail) {
    return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'EmailComposer', 'sendNonEnglishEmail', [ params ]);
}

EmailComposer.prototype.attachMultipleImages = function(params, success, fail) {
    if(params.action == null || params.action == undefined){
        params.action = "android.intent.action.SEND";
    }
    if(params.type == null || params.type == undefined){
        params.type = "image/jpg";
    }
    return cordova.exec(function(args) {
        if(success)
            success(args);
        }, function(args) {
            if(fail)
                fail(args);
        }, 'EmailComposer', 'attachMultipleImages', [ params ]);
}

EmailComposer.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.EmailComposer = new EmailComposer();  
  return window.plugins.EmailComposer;
};

cordova.addConstructor(EmailComposer.install);
