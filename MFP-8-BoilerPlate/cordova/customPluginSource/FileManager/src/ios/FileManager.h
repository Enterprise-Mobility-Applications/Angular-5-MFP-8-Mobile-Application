
#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <Cordova/CDV.h>

@interface FileManager : CDVPlugin <UIActionSheetDelegate, UIDocumentInteractionControllerDelegate> {
    BOOL isSaveOpen;
}
@property (nonatomic, retain) NSString *docName;
@property (nonatomic, retain) NSString *docExt;

- (void) download:(CDVInvokedUrlCommand*)command;
- (void) open:(CDVInvokedUrlCommand*)command;
- (void) save:(CDVInvokedUrlCommand*)command;

@end
