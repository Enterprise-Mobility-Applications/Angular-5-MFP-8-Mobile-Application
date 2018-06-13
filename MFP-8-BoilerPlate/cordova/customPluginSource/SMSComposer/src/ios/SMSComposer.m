#import "SMSComposer.h"

@implementation SMSComposer
@synthesize callbackID;
-(CDVPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (SMSComposer*)[super init];
    return self;
}
/*
 *  Function: showSMSComposer
 *  Description: Opens SMS Composer with message and reciepent number(s)
 */

- (void)showSMSComposer:(CDVInvokedUrlCommand*) command
{
	Class messageClass = (NSClassFromString(@"MFMessageComposeViewController"));
	if (messageClass != nil) {          
	     if (![messageClass canSendText]) {
			UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notice" message:@"SMS Text not available."
														   delegate:self cancelButtonTitle:@"OK" otherButtonTitles: nil];
			[alert show];
		
			return;
        }
		
    } else {
		UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notice" message:@"SMS Text not available."
													   delegate:self cancelButtonTitle:@"OK" otherButtonTitles: nil];
		[alert show];

		return;
	}
    NSString* toRecipientsString;
	NSString* body = [command.arguments objectAtIndex:1];
	if ([command.arguments objectAtIndex:0]) {
        toRecipientsString =NULL;
    }
    else{
    toRecipientsString = [command.arguments objectAtIndex:0];
    }
       MFMessageComposeViewController *picker = [[MFMessageComposeViewController alloc] init];
    picker.messageComposeDelegate = self;
	if(body != nil)
		picker.body = [command.arguments objectAtIndex:1];
	if(toRecipientsString != nil)
		[picker setRecipients:[ toRecipientsString componentsSeparatedByString:@","]];
    self.callbackID = command.callbackId;//[arguments pop];
    [self.viewController presentModalViewController:picker animated:YES];
   
}

/*  
 *  Function: messageComposeViewController
 *  Description: Dismisses the composition interface when users tap Cancel or Send. 
 *      Proceeds to update the message field with the result of the operation.
 */
- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result
{   
    // Notifies users about errors associated with the interface
	NSString* webviewResult=[[NSString alloc]init];
	
	switch (result)
	{
		case MessageComposeResultCancelled:
            webviewResult = [NSString stringWithFormat:@"Cancelled"];
            break;
		case MessageComposeResultSent:
			 webviewResult = [NSString stringWithFormat:@"Sent"];
            break;
		case MessageComposeResultFailed:
			webviewResult = [NSString stringWithFormat:@"Failed"];
            break;
		default:
			webviewResult = [NSString stringWithFormat:@"NotSent"];
            break;
	}
	
    [self.viewController dismissModalViewControllerAnimated:YES];
    
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:webviewResult];
    //[self writeJavascript:[pluginResult toSuccessCallbackString:self.callbackID]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackID];
}

@end