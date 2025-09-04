import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from 'widget-sdk-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="context() && theme(); else loading" [ngStyle]="containerStyle()">
      <div [ngStyle]="cardStyle()">
        <div [ngStyle]="headerStyle()">
          <img [src]="context().user?.avatarUrl" [alt]="context().user?.name" [ngStyle]="avatarStyle()" />
          <div>
            <div style="font-weight:600">{{ context().user?.name }}</div>
            <div [ngStyle]="mutedStyle()">{{ context().user?.email }}</div>
          </div>
          <div style="margin-left:auto">
            <span [ngStyle]="badgeStyle()">{{ context().user?.role }}</span>
          </div>
        </div>

        <div [ngStyle]="{ marginTop: theme().spacingLg }">
          <div [ngStyle]="{ fontSize: '14px', color: theme().colorMuted }">Organization</div>
          <div [ngStyle]="{ display: 'flex', gap: theme().spacingMd, alignItems: 'center', marginTop: theme().spacingSm }">
            <div style="font-weight:600">{{ context().org?.name }}</div>
            <span [ngStyle]="badgeStyle()">{{ context().org?.plan }}</span>
          </div>
        </div>

        <div [ngStyle]="{ marginTop: theme().spacingLg, display: 'flex', gap: theme().spacingMd }">
          <button [ngStyle]="buttonStyle()" (click)="makeApiCall()">Make API Call</button>
          <a href="#" [ngStyle]="{ alignSelf: 'center', color: theme().colorMuted, textDecoration: 'underline' }">Learn more</a>
        </div>
      </div>
    </div>
    <ng-template #loading>Loading...</ng-template>
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

  containerStyle = () => ({
    fontFamily: this.theme()?.fontFamily || 'sans-serif',
    padding: this.theme()?.spacingLg || '16px',
    color: this.theme()?.colorText
  });

  cardStyle = () => ({
    background: this.theme()?.colorSurface,
    borderRadius: this.theme()?.borderRadius,
    border: '1px solid #e5e7eb',
    padding: this.theme()?.spacingLg
  });

  headerStyle = () => ({ display: 'flex', alignItems: 'center', gap: this.theme()?.spacingMd });
  avatarStyle = () => ({ width: '48px', height: '48px', borderRadius: '50%' });
  mutedStyle = () => ({ color: this.theme()?.colorMuted });
  badgeStyle = () => ({
    display: 'inline-block',
    background: this.theme()?.colorPrimary,
    color: this.theme()?.colorPrimaryText,
    borderRadius: '9999px',
    padding: '2px 8px',
    fontSize: '12px'
  });
  buttonStyle = () => ({
    height: this.theme()?.button?.height || '36px',
    padding: `0 ${this.theme()?.button?.paddingInline || '12px'}`,
    background: this.theme()?.colorPrimary,
    color: this.theme()?.colorPrimaryText,
    border: 'none',
    borderRadius: this.theme()?.borderRadius,
    cursor: 'pointer'
  });

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


