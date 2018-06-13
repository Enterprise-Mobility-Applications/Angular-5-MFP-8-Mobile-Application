
#import <Foundation/Foundation.h>
#import <MessageUI/MFMailComposeViewController.h>
#import <Cordova/CDVPlugin.h>

@interface EmailComposer : CDVPlugin < MFMailComposeViewControllerDelegate > {
    
}

- (void) showEmailComposer:(CDVInvokedUrlCommand*) command;

@end
