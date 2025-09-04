import type { ApiRequestOptions, PlatformAPI } from 'widget-sdk-core';

type DevContext = {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'viewer';
    avatarUrl: string;
  };
  org: {
    id: string;
    name: string;
    plan: 'free' | 'pro' | 'enterprise';
    locale: string;
  };
};

type DevTheme = {
  colorPrimary: string;
  colorPrimaryText: string;
  colorSurface: string;
  colorText: string;
  colorMuted: string;
  borderRadius: string;
  spacingSm: string;
  spacingMd: string;
  spacingLg: string;
  fontFamily: string;
  button: {
    height: string;
    paddingInline: string;
  };
};

const context: DevContext = {
  user: {
    id: 'u_local_001',
    name: 'Ava Developer',
    email: 'ava.dev@example.com',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/96?img=3'
  },
  org: {
    id: 'org_local_001',
    name: 'Acme Corp (Local)',
    plan: 'pro',
    locale: 'en-US'
  }
};

const theme: DevTheme = {
  colorPrimary: '#3b82f6',
  colorPrimaryText: '#ffffff',
  colorSurface: '#ffffff',
  colorText: '#111827',
  colorMuted: '#6b7280',
  borderRadius: '10px',
  spacingSm: '6px',
  spacingMd: '12px',
  spacingLg: '20px',
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  button: {
    height: '36px',
    paddingInline: '14px'
  }
};

const mockApi: PlatformAPI = {
  async getContext() {
    return context as any;
  },
  async getTheme() {
    return theme as any;
  },
  async apiRequest(req: ApiRequestOptions) {
    // Simple routing for demo
    if (req.url === '/api/users' && req.method?.toUpperCase() === 'POST') {
      return { ok: true, user: context.user, received: req.data };
    }
    if (req.url === '/api/org' && (!req.method || req.method.toUpperCase() === 'GET')) {
      return { ok: true, org: context.org };
    }
    return { ok: true, echo: req };
  }
};

(globalThis as any).__WIDGET_SDK_DEV__ = mockApi;


