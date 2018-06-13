#import "EmailComposer.h"

@implementation EmailComposer


//Displays the Email Composer Screen using MFMailComposeViewController
- (void) showEmailComposer:(CDVInvokedUrlCommand*) command//{(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{	
  
	/*NSString* toRecipientsString = [options valueForKey:@"toRecipients"];
	NSString* ccRecipientsString = [options valueForKey:@"ccRecipients"];
	NSString* bccRecipientsString = [options valueForKey:@"bccRecipients"];
	NSString* subject = [options valueForKey:@"subject"];
	NSString* body = [options valueForKey:@"body"];
	NSString* isHTML = [options valueForKey:@"bIsHTML"];
    NSString* imageAttachmentPaths = [options valueForKey:@"imageAttachments"];
    NSString* imageNames = [options valueForKey:@"imageNames"];*/
    NSString* toRecipientsString = [[command.arguments objectAtIndex:0]valueForKey:@"toRecipients"];
    NSString* ccRecipientsString = [[command.arguments objectAtIndex:0]valueForKey:@"ccRecipients"];
    NSString* bccRecipientsString = [[command.arguments objectAtIndex:0]valueForKey:@"bccRecipients"];
    NSString* subject = [[command.arguments objectAtIndex:0]valueForKey:@"subject"];
    NSString* body = [[command.arguments objectAtIndex:0]valueForKey:@"body"];
    NSString* isHTML = [[command.arguments objectAtIndex:0]valueForKey:@"bIsHTML"];
    NSString* imageAttachmentPaths = [[command.arguments objectAtIndex:0]valueForKey:@"imageAttachments"];
    NSString* imageNames = [[command.arguments objectAtIndex:0]valueForKey:@"imageNames"];
    
	//The class provides a standard interface that manages the editing and sending an email message. You can use this view controller to display a //standard email view inside your application and populate the fields of that view with initial values, such as the subject, email recipients, //body text, and attachments. 

    MFMailComposeViewController *picker = [[MFMailComposeViewController alloc] init];
	
	//The mail composition view controller�s delegate.
	picker.mailComposeDelegate = self;
    
	// Set subject
	if(subject != nil)
		[picker setSubject:subject];
	// set body
	if(body != nil)
	{
		if(isHTML != nil && [isHTML boolValue])
		{
			[picker setMessageBody:body isHTML:YES];
		}
		else
		{
			[picker setMessageBody:body isHTML:NO];
		}
	}
    
	// Set recipients
	if(toRecipientsString != nil)
	{
		[picker setToRecipients:[ toRecipientsString componentsSeparatedByString:@","]];
	}
	if(ccRecipientsString != nil)
	{
		[picker setCcRecipients:[ ccRecipientsString componentsSeparatedByString:@","]]; 
	}
	if(bccRecipientsString != nil)
	{
		[picker setBccRecipients:[ bccRecipientsString componentsSeparatedByString:@","]];
	}
    
    if(imageAttachmentPaths != nil)
	{
        NSLog(@" Image Attachment Str Reached: %@", imageAttachmentPaths);
        NSArray *imageArray = [imageAttachmentPaths componentsSeparatedByString:@","];
        NSArray *imageNameArray = [imageNames componentsSeparatedByString:@","];
        
        int elemindex = [imageArray count];
        
        for(int i=0;i<elemindex;i++)
        {
            NSUInteger indexint = i;
            NSLog(@" Image Paths = %@", [imageArray objectAtIndex:indexint]);
            
            UIImage *myimageFile = [UIImage imageWithContentsOfFile:[imageArray objectAtIndex:indexint]];
            
            NSData *data = UIImageJPEGRepresentation(myimageFile,0.04);
            
            // Attach image data to the email
            [picker addAttachmentData:data mimeType:@"image/jpg" fileName:[imageNameArray objectAtIndex:indexint]];   
        }
                
	}

    
    if (picker != nil) {
        [[ super viewController ] presentModalViewController:picker animated:YES];
    }
    

    
}



// Dismisses the email composition interface when users tap Cancel or Send. Proceeds to update the message field with the result of the operation.
- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error 
{   
    // Notifies users about errors associated with the interface
	int webviewResult = 0;
    
    switch (result)
    {
        case MFMailComposeResultCancelled:
			webviewResult = 0;
            break;
        case MFMailComposeResultSaved:
			webviewResult = 1;
            break;
        case MFMailComposeResultSent:
			webviewResult =2;
            break;
        case MFMailComposeResultFailed:
            webviewResult = 3;
            break;
        default:
			webviewResult = 4;
            break;
    }
    
    [[ super viewController ] dismissModalViewControllerAnimated:YES];
    
	NSString* jsString = [[NSString alloc] initWithFormat:@"window.emailComposer._didFinishWithResult(%d);",webviewResult];
    NSLog(@"Callback Result: %@ & Corresponding Integer: %d",jsString,webviewResult);
	//[self writeJavascript:jsString];
    [self.commandDelegate evalJs:jsString];
	
    
}



@end