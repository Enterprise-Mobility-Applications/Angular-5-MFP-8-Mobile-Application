#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

#ifndef k_DATEPICKER_DATETIME_FORMAT
#define k_DATEPICKER_DATETIME_FORMAT @"yyyy-MM-dd'T'HH:mm:ss'Z'"
#endif

@interface DatePicker : CDVPlugin{
	BOOL isVisible;
}

@property (nonatomic, retain) UIView *datePickerSheet;
@property (nonatomic, retain) UIDatePicker* datePicker;
@property (nonatomic, retain) NSString* callbackID;

- (void) show:(CDVInvokedUrlCommand*) command;
- (void) closeDatePicker:(CDVInvokedUrlCommand*) command;

@end
