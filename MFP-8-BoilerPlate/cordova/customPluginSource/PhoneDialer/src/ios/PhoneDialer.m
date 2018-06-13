#import "PhoneDialer.h"

@implementation PhoneDialer
@synthesize phoneNumber;
- (void) dialPhone:(CDVInvokedUrlCommand*) command{//(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options {
    
    //NSString* ph = [options valueForKey:@"number"];
    phoneNumber = [[NSString alloc]initWithString:[[command.arguments objectAtIndex:0]valueForKey:@"number"]];
    UIAlertView *confirmationAlert = [[UIAlertView alloc]initWithTitle:[NSString stringWithFormat:@"%@",phoneNumber] message:nil
        delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"Call", nil];
    [confirmationAlert show];
    
}
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    NSLog(@"buttonIndex->%ld", (long)buttonIndex);
    UIDevice *device = [UIDevice currentDevice];
    if(buttonIndex == 1){
        if ([[device model] isEqualToString:@"iPhone"] ) {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[[NSString stringWithFormat:@"tel:%@", phoneNumber]
                                    stringByReplacingOccurrencesOfString:@" " withString:@""]]];
        }
        else {
            UIAlertView *Notpermitted=[[UIAlertView alloc] initWithTitle:@"Alert" message:@"Your device doesn't support this feature."
                                    delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
            [Notpermitted show];
       
        }
    }
}
@end
