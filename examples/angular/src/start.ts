import '../../shared/dev-mock';
import 'zone.js';
import '@angular/compiler';
import { createApplication } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import { PlatformService } from 'widget-sdk-angular';
import { AppComponent } from './root-app.component';

export async function start(shadowRoot: ShadowRoot) {
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const appRef = await createApplication({
    providers: [
      PlatformService,
      {
        provide: APP_INITIALIZER,
        useFactory: (platform: PlatformService) => () => platform.initPlatform({ element: mount }),
        deps: [PlatformService],
        multi: true,
      },
    ],
  });

  appRef.bootstrap(AppComponent, mount);
}