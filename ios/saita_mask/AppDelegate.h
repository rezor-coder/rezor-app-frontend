#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "saita_mask-Swift.h"
#import "PreventScreenShotModule.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,RCTBridgeModule>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) PreventScreenShotModule *preventScreenShotModule;

@end
