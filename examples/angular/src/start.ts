import '../../shared/dev-mock';
import 'zone.js';
import '@angular/compiler';
import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './root-app.component';

export async function start(shadowRoot: ShadowRoot) {
  const appRef = await createApplication({ providers: [] });
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);
  appRef.bootstrap(AppComponent, mount);
}


