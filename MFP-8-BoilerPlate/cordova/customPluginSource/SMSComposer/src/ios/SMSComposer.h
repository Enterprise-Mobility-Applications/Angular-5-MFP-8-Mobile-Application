#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMessageComposeViewController.h>

@interface SMSComposer : CDVPlugin <MFMessageComposeViewControllerDelegate> {
    
}
@property (nonatomic, copy) NSString* callbackID;
- (void)showSMSComposer:(CDVInvokedUrlCommand*) command;
@end
