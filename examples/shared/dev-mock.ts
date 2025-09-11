/**
 * Development Mock Support for Testing Iframe Scenarios
 *
 * This module provides mock implementations to simulate parent-child
 * communication during development without needing a separate host app.
 * It intercepts the core package calls and provides mock responses.
 *
 * SHARED ACROSS ALL EXAMPLES (React, Vue, Angular)
 */

// Mock data that simulates what a parent would provide
export const MOCK_CONTEXT = {
  user: {
    id: 'dev-user-123',
    name: 'John Developer',
    email: 'john.dev@example.com',
    role: 'admin',
  },
  company: {
    id: 'dev-company-456',
    name: 'Dev Company Inc',
    domain: 'dev-company.com',
  },
  environment: 'development',
};

export const MOCK_THEME = {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  backgroundColor: '#ffffff',
  textColor: '#212529',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
  borderRadius: '4px',
};

// Mock API responses
export const MOCK_API_RESPONSES: Record<string, any> = {
  '/api/users': {
    users: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
    ],
  },
  '/api/dashboard/stats': {
    totalUsers: 1250,
    activeUsers: 890,
    conversion: 0.78,
  },
  '/api/profile': {
    profile: {
      completeness: 85,
      lastLogin: '2024-01-15T10:30:00Z',
      preferences: {
        notifications: true,
        theme: 'auto',
      },
    },
  },
};

// Store original implementations
let originalMethods: any = {};

/**
 * Initialize dev mock mode by intercepting core package methods
 * This simulates what the parent window would normally provide
 */
export function initDevMock() {
  // Set up global mock data IMMEDIATELY (before any core package calls)
  (window as any).__DEV_MOCK_MODE__ = true;
  (window as any).__MOCK_CONTEXT__ = MOCK_CONTEXT;
  (window as any).__MOCK_THEME__ = MOCK_THEME;
  (window as any).__MOCK_API_RESPONSES__ = MOCK_API_RESPONSES;

  // Set up mock data updates
  setupMockUpdates();
}

/**
 * Set up periodic mock data updates to simulate parent changes
 */
function setupMockUpdates() {
  // Simulate theme changes every 10 seconds
  setInterval(() => {
    const colors = [
      '#007bff',
      '#28a745',
      '#dc3545',
      '#ffc107',
      '#6f42c1',
      '#e83e8c',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    MOCK_THEME.primaryColor = randomColor;

    // Trigger a page reload to show the change (simple approach)
    // In a real app, you'd use the observable system
    window.location.reload();
  }, 10000);

  // Simulate context changes every 15 seconds
  setInterval(() => {
    const envs = ['development', 'staging', 'production'];
    const currentEnv = MOCK_CONTEXT.environment;
    const otherEnvs = envs.filter(e => e !== currentEnv);
    const newEnv = otherEnvs[Math.floor(Math.random() * otherEnvs.length)];

    MOCK_CONTEXT.environment = newEnv;

    // Trigger a page reload to show the change (simple approach)
    window.location.reload();
  }, 15000);
}

/**
 * Check if dev mock should be enabled
 * Works across different build tools (Vite, Webpack, etc.)
 */
export function shouldEnableDevMock(): boolean {
  // Different ways to check dev mode across build tools
  const isDev =
    (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || // Vite
    (typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'development') || // Webpack/Node
    false;

  const isStandalone = window.self === window.top;
  const hasMockParam = new URLSearchParams(window.location.search).has('mock');

  return isDev && (isStandalone || hasMockParam);
}

/**
 * Utility to restore original methods (for testing)
 */
export function restoreOriginalMethods() {
  if (Object.keys(originalMethods).length > 0) {
    import('widget-sdk-core').then(core => {
      if (originalMethods.getContext)
        (core as any).getContext = originalMethods.getContext;
      if (originalMethods.getTheme)
        (core as any).getTheme = originalMethods.getTheme;
      if (originalMethods.apiRequest)
        (core as any).apiRequest = originalMethods.apiRequest;
    });
  }
}
