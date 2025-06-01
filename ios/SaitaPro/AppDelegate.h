#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "Rezor-Swift.h"
#import "PreventScreenShotModule.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,RCTBridgeModule>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) PreventScreenShotModule *preventScreenShotModule;

@end
