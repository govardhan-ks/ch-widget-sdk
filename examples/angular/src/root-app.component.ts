import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModule, PlatformService } from 'widget-sdk-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PlatformModule],
  template: `
    <div *ngIf="context() && theme()" style="font-family: sans-serif; padding: 16px;">
      <h1>Widget Dashboard (Angular)</h1>
      <pre>Context: {{ context() | json }}</pre>
      <pre>Theme: {{ theme() | json }}</pre>
      <button (click)="makeApiCall()">Make API Call</button>
    </div>
    <div *ngIf="!context() || !theme()">Loading...</div>
  `
})
export class AppComponent {
  private platform = inject(PlatformService);
  context = signal<any | null>(null);
  theme = signal<any | null>(null);

  constructor() {
    this.init();
  }

  private async init() {
    this.context.set(await this.platform.getContext());
    this.theme.set(await this.platform.getTheme());
  }

  async makeApiCall() {
    try {
      const response = await this.platform.apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}


