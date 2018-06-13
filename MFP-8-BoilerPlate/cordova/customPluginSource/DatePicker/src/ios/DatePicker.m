#import <Cordova/CDV.h>
#import "DatePicker.h"

@implementation DatePicker

@synthesize datePickerSheet;
@synthesize datePicker;
@synthesize callbackID;

- (void)show:(CDVInvokedUrlCommand*) command
{
	if (isVisible) {
		return;
	}
    NSLog(@"Date->%@",[command.arguments objectAtIndex:0]);
    NSDictionary *arguments = [command.arguments objectAtIndex:0];
    NSString *calendarMode = arguments[@"mode"];
        
    callbackID = [[NSString alloc]initWithString:command.callbackId];
    datePickerSheet = [[UIView alloc]initWithFrame:CGRectMake(0, [[UIScreen mainScreen] bounds].size.height - 230, [[UIScreen mainScreen] bounds].size.width, 230)];
    datePickerSheet.backgroundColor = [UIColor whiteColor];
    UIButton *playButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    
    datePicker = [[UIDatePicker alloc] initWithFrame:CGRectMake(0, 30, [[UIScreen mainScreen] bounds].size.width, 230)];
    //datePicker.backgroundColor = [UIColor grayColor];
    if ([calendarMode isEqualToString:@"showCalendar"]) {
        [datePicker setMinimumDate: [NSDate date]];
    }
    
    UIImage *buttonImageNormal = [UIImage imageNamed:@"picker.done.png"];
    
    playButton.frame = CGRectMake(self.datePickerSheet.frame.size.width - 65, 7.0, 54.0, 28.0);
    [playButton addTarget:self action:@selector(dismissActionSheet:) forControlEvents:UIControlEventTouchUpInside];
    [playButton setBackgroundImage:buttonImageNormal forState:UIControlStateNormal];
    
    [datePickerSheet addSubview:playButton];
    
    [datePickerSheet addSubview:datePicker];
    [self.webView.superview addSubview:datePickerSheet];
    [self configureDatePicker:[command.arguments objectAtIndex:0]];
	isVisible = YES;
}

- (void)dismissActionSheet:(id)sender {
    NSString *date = [[NSString alloc] initWithFormat:@"%f", [self.datePicker.date timeIntervalSince1970]];
    NSTimeInterval interval = [self.datePicker.date timeIntervalSince1970];
    NSNumber *timestamp = @(interval * 1000.);
    NSString *dateString = [timestamp stringValue];
    NSLog(@"Date--->%@ callback-->%@", self.datePicker.date, callbackID);
    NSLog(@"Return Date string--->%@", dateString);
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: dateString];
    [datePickerSheet removeFromSuperview];
    isVisible = NO;
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
}
- (void)configureDatePicker:(NSMutableDictionary *)optionsOrNil {
 	NSString *mode = [optionsOrNil objectForKey:@"mode"];
	NSString *dateString = [optionsOrNil objectForKey:@"date"];
	BOOL allowFutureDates = NO;
    NSDateFormatter *isoTimeFormatter = [[NSDateFormatter alloc]init];
    [isoTimeFormatter setTimeZone: [NSTimeZone defaultTimeZone]];
    [isoTimeFormatter setDateFormat:k_DATEPICKER_DATETIME_FORMAT];
	if ([[optionsOrNil objectForKey:@"allowFutureDates"] intValue] == 1) {
		allowFutureDates = YES;
	}
    
	if ( ! allowFutureDates) {
		self.datePicker.maximumDate = [NSDate date];
	}
    
	self.datePicker.date = [isoTimeFormatter dateFromString:dateString];
    
	if ([mode isEqualToString:@"date"] || [mode isEqualToString:@"showCalendar"]) {
		self.datePicker.datePickerMode = UIDatePickerModeDate;
	}
	else if ([mode isEqualToString:@"time"])
	{
		self.datePicker.datePickerMode = UIDatePickerModeTime;
	}
	else
	{
		self.datePicker.datePickerMode = UIDatePickerModeDateAndTime;
	}
}

- (void)closeDatePicker:(CDVInvokedUrlCommand*) command{
	isVisible = NO;
	[datePickerSheet removeFromSuperview];
}
@end
