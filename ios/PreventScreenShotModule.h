//
//  PreventScreenShotModule.h
//  saita_mask
//
//  Created by user on 29/03/23.
//

#ifndef PreventScreenShotModule_h
#define PreventScreenShotModule_h


#endif /* PreventScreenShotModule_h */
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface PreventScreenShotModule : RCTEventEmitter <RCTBridgeModule>

+ (id)allocWithZone:(NSZone *)zone;
- (void)sendScreenshotEvent;
@end
