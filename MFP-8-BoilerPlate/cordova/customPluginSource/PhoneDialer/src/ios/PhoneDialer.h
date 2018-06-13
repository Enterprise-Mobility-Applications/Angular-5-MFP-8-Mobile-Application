#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface PhoneDialer : CDVPlugin<UIAlertViewDelegate>

- (void) dialPhone:(CDVInvokedUrlCommand*) command;
@property(nonatomic, retain) NSString *phoneNumber;
@end

