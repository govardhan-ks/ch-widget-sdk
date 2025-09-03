import type { ApiRequestOptions, PlatformAPI } from 'widget-sdk-core';

const mockApi: PlatformAPI = {
  async getContext() {
    return {
      user: { id: 'u_local', name: 'Local Dev User' },
      org: { id: 'org_local', name: 'Local Org' }
    } as any;
  },
  async getTheme() {
    return {
      colorPrimary: '#3b82f6',
      colorText: '#111827'
    } as any;
  },
  async apiRequest(req: ApiRequestOptions) {
    return { ok: true, echo: req };
  }
};

(globalThis as any).__WIDGET_SDK_DEV__ = mockApi;


