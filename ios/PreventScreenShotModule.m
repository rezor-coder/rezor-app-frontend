//
//  PreventScreenShotModule.m
//  saita_mask
//
//  Created by user on 29/03/23.
//

#import "PreventScreenShotModule.h"

@implementation PreventScreenShotModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static PreventScreenShotModule *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"screenshotEvent"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (void)sendScreenshotEvent
{
  NSLog(@"fdsfsdsfdsfdsfdsfdsf");
  NSLog(@"fdsfsdsfdsfdsfdsfdsf %d", hasListeners);
//  if (hasListeners) { // Only send events if anyone is listening
//            [self showAlertMsg:self.window.rootViewController title:@"Warning" message:@"It isn't safe to take screenshot on crypto apps"];

    [self sendEventWithName:@"screenshotEvent" body:@"Tap enter code here` on Cancel button      from Objc"];
//  }
}

@end

