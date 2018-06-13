#import "FileManager.h"
#import <Cordova/CDV.h>

@implementation FileManager
@synthesize docName, docExt;

-(NSString*)getPath{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *resourceDocPath = [paths objectAtIndex:0];
    NSString *directoryName = @"Doc";
    [[NSFileManager defaultManager]createDirectoryAtPath:[resourceDocPath stringByAppendingPathComponent:directoryName] withIntermediateDirectories:NO attributes:nil error:nil];
    return [resourceDocPath stringByAppendingPathComponent:directoryName];
}

/*
 Function name: download
 Description: This method accept the path of file and downloads document.
 */

- (void) open:(CDVInvokedUrlCommand *)command{
    
    NSString *fileName = [command.arguments objectAtIndex:0];
    NSString *fileExtension = [command.arguments objectAtIndex:1];
    
    NSString *resourceDocPath = self.getPath;
    NSString *filePath = [resourceDocPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.%@",fileName, fileExtension]];
  
    // Store the Data locally as PDF File
    NSString* callbackID = command.callbackId;
    CDVPluginResult* pluginResult;
    bool isValid = FALSE;
    NSString *fileToOpen = [resourceDocPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.%@",fileName, fileExtension]];
     UIDocumentInteractionController* docController;
    //create NSURL to that path
    NSURL *url =[NSURL fileURLWithPath:fileToOpen];
    //use the UIDocInteractionController API to get list of devices that support the file type
    
    docController = [UIDocumentInteractionController interactionControllerWithURL:url];
    docController.delegate = self;
    //    [docController retain];
    CDVViewController *controller = (CDVViewController*) [super viewController];
    CGRect rect = CGRectMake(0, 0, controller.view.bounds.size.width, controller.view.bounds.size.height);
    if(! [[fileExtension capitalizedString]compare:@"PDF"]){
        isValid = [docController presentOpenInMenuFromRect:rect inView: controller.view animated:YES];
    }
    if(!isValid){
        isValid=[docController presentPreviewAnimated:YES];
    }
    if(isValid)
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@.%@", fileName, fileExtension]];
    else
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"noViewer"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
    
    // Now create Request for the file that was saved in your documents folder
    url = [NSURL fileURLWithPath:filePath];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(10, 10, 200, 200)];
    [webView setUserInteractionEnabled:YES];
    [webView loadRequest:requestObj];
    return;
   

   }

/*
 Function name: download
 Description: This method accept the path of file and downloads it
 */
- (void) download:(CDVInvokedUrlCommand *)command{     
    
    NSString *pdfURL = [command.arguments objectAtIndex:0];
    NSString *fileName = [command.arguments objectAtIndex:1];
    NSString *fileExtension = [command.arguments objectAtIndex:2];
        
    [self.commandDelegate runInBackground:^{
        
    // Get the PDF Data from the url in a NSData Object
    NSData *pdfData = [[NSData alloc] initWithContentsOfURL:[NSURL URLWithString:pdfURL]];
    //NSLog(@"PdfData-->%@", pdfData);
    NSString *resourceDocPath = self.getPath;
    
    NSString *dot = @".";
    NSString *fileToSave = [NSString stringWithFormat: @"%@%@%@",
                          fileName, dot, fileExtension];
    
    
    NSString *filePath = [resourceDocPath stringByAppendingPathComponent:fileToSave];
    [pdfData writeToFile:filePath atomically:YES];
    // Store the Data locally as PDF File
    
    NSString* callbackID = command.callbackId;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:fileName];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
    return;
        
    }];
    
    NSString* callbackID = command.callbackId;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT messageAsString:[NSString stringWithFormat:@"KEEP_CALLBACK"]];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
    return;
}

-(void) save:(CDVInvokedUrlCommand *)command{
    [self.commandDelegate runInBackground:^{
        
        NSString *base64String = [command.arguments objectAtIndex:0];
        NSString *fileExtension = [command.arguments objectAtIndex:1];
        NSString *fileName = [command.arguments objectAtIndex:2];
        NSString *dot = @".";
        
        // set fileName
        fileName = [fileName stringByAppendingString: dot];
        fileName = [fileName stringByAppendingString: fileExtension];
        NSLog(@"Full FileName ==> %@", fileName);
        
        if (base64String != nil && [base64String length] > 0) {
            
            NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64String options:0];
            UIImage *image = [[UIImage alloc] initWithData:imageData];
            
            // converts the UIImage to NSData
            NSData *pngImageData = UIImagePNGRepresentation(image);
            
            NSString *libPath = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES)[0];
            NSString *libPathNoSync = [libPath stringByAppendingPathComponent:@"NoCloud"];
            NSFileManager *fileManager = [NSFileManager defaultManager];//create instance of NSFileManager
            
            // Create the directory if necessary.
            [fileManager createDirectoryAtPath:libPathNoSync withIntermediateDirectories:YES attributes:nil error:nil];
            
            NSString *imagePath = [libPathNoSync stringByAppendingPathComponent:fileName];
            
            // writeToFile
            bool success = [fileManager createFileAtPath:imagePath contents:pngImageData attributes:nil];
            
            if(success){
                // write to documents folder was successfull
                
                // add the image to camera roll
                UIImage * savedImage = [UIImage imageWithContentsOfFile:imagePath];
                UIImageWriteToSavedPhotosAlbum(savedImage, nil, nil, nil);
                NSLog(@"Saved Image Path ==> %@", imagePath);
                
                NSString* callbackID = command.callbackId;
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:imagePath];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                return;

                
            }else{
                imagePath = [imagePath stringByAppendingString: @" - error writing image to documents folder"];
                
                NSString* callbackID = command.callbackId;
                CDVPluginResult * pluginResult  = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:imagePath];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                return;
            }
            
        } else {
            
            NSString* callbackID = command.callbackId;
            CDVPluginResult * pluginResult  = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"no valid base64 image data was passed"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
            return;
        }
        
    }];

}




/*
 Function name: documentInteractionControllerViewControllerForPreview
 Description: Delegate function for preview annimation.
 */
- (UIViewController*)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller
{
    CDVViewController* cont= (CDVViewController*)[ super viewController ];
    return cont;
}

@end
