// Angular iframe entry point - similar to React main.tsx
import '@angular/compiler'; // Import compiler for JIT support
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from 'widget-sdk-angular';
import { RootAppComponent } from './root-app.component';

// Bootstrap the Angular app for iframe usage with JIT support
bootstrapApplication(RootAppComponent, {
  providers: [importProvidersFrom(CommonModule), PlatformService],
}).catch(err => console.error('Error starting Angular iframe app:', err));
