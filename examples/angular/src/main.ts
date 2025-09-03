import 'zone.js';
import '../../shared/dev-mock';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './root-app.component';

bootstrapApplication(AppComponent).catch(err => console.error(err));


