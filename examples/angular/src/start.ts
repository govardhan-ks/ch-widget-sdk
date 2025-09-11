import 'zone.js';
import '@angular/compiler';
import { createApplication } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import { PlatformService } from 'widget-sdk-angular';
import { RootAppComponent } from './root-app.component';

export async function start(element: HTMLElement) {

  const appRef = await createApplication({
    providers: [
      PlatformService,
      {
        provide: APP_INITIALIZER,
        useFactory: (platform: PlatformService) => () => platform.initialize({ element }),
        deps: [PlatformService],
        multi: true,
      },
    ],
  });

  appRef.bootstrap(RootAppComponent, element);
}