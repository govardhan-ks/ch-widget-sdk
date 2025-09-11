import { connect, WindowMessenger, debug as penpalDebug } from 'penpal';

export interface ApiRequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: any;
}

export interface PlatformAPI {
  getContext(): Promise<Record<any, any>>;
  getTheme(): Promise<Record<string, any>>;
  apiRequest(req: ApiRequestOptions): Promise<any>;
}

/**
 * Internal state
 */
let connection: PlatformAPI | null = null;
let element: HTMLElement | null = null;
let widgetId: string | null = null;

/**
 * Simple Observable implementation for platform data
 */
class PlatformObservable<T> {
  private observers: Set<(value: T) => void> = new Set();
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  subscribe(observer: (value: T) => void): () => void {
    // Always send the current value immediately
    observer(this._value);

    this.observers.add(observer);

    // Return unsubscribe function
    return () => {
      this.observers.delete(observer);
    };
  }

  next(value: T): void {
    this._value = value;
    this.observers.forEach(observer => observer(value));
  }

  get value(): T {
    return this._value;
  }
}

/**
 * Platform observables - single source of truth
 */
let contextObservable: PlatformObservable<any> | null = null;
let themeObservable: PlatformObservable<any> | null = null;

/**
 * Initialize core transport.
 * - If inside an iframe → use Penpal
 * - If web component detected → use DOM events with detected element
 * - If standalone with custom element → use DOM events
 */
export async function initPlatform(ctx?: { element?: HTMLElement }) {
  if (connection) return connection;
  penpalDebug('core-sdk');

  if (window.self !== window.top) {
    // iframe case → Penpal
    const messenger = new WindowMessenger({
      remoteWindow: window.parent,
      allowedOrigins: ['*'],
    });
    const penpalConnection = await connect({
      messenger,
      methods: {
        updateTheme: (newTheme: any) => {
          if (themeObservable) {
            themeObservable.next(newTheme);
          }
        },
        updateContext: (newContext: any) => {
          if (contextObservable) {
            contextObservable.next(newContext);
          }
        },
      },
    }).promise;
    connection = penpalConnection as unknown as PlatformAPI;
  }

  // Check if we're in a web component context
  const webComponentElement = ctx?.element;

  if (webComponentElement) {
    // WebComponent case → DOM CustomEvents
    element = webComponentElement;
    // Generate unique widget ID for this instance
    widgetId = generateWidgetId(webComponentElement);
    connection = {
      getContext: () => requestFromElement('getContext'),
      getTheme: () => requestFromElement('getTheme'),
      apiRequest: (req: ApiRequestOptions) =>
        requestFromElement('apiRequest', req),
    };

    // Setup theme change listener for web component
    const themeChangeHandler = (e: Event) => {
      const custom = e as CustomEvent;
      if (
        custom.detail.widgetId === widgetId &&
        custom.detail.type === 'themeChange'
      ) {
        if (themeObservable) {
          themeObservable.next(custom.detail.theme);
        }
      }
    };
    webComponentElement.addEventListener(
      'widget-theme-change',
      themeChangeHandler as any
    );
  }

  if (connection) {
    return connection;
  }

  throw new Error(
    'No valid platform transport found (iframe or web component required)'
  );
}

/**
 * Returns the detected/initialized platform element if available.
 */
export function getPlatformElement(): HTMLElement | null {
  return element;
}

/**
 * Generate unique widget ID for event scoping
 */
function generateWidgetId(element: HTMLElement): string {
  // Use existing ID if available
  if (element.id) {
    return element.id;
  }

  // Generate unique ID based on element position and tag
  const tagName = element.tagName.toLowerCase();
  const index = Array.from(document.querySelectorAll(tagName)).indexOf(element);
  const uniqueId = `${tagName}-${index}-${Date.now()}`;

  // Set the ID on the element for future reference
  element.id = uniqueId;

  return uniqueId;
}

/**
 * DOM event request handler for WebComponent use case
 */
function requestFromElement<T = any>(type: string, payload?: any): Promise<T> {
  return new Promise(resolve => {
    if (!element || !widgetId)
      throw new Error('Platform element not initialized');

    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      // Only handle events for this specific widget instance
      if (custom.detail.widgetId === widgetId) {
        element?.removeEventListener(`widget-response`, handler as any);
        resolve(custom.detail.data);
      }
    };

    element.addEventListener(`widget-response`, handler as any);

    // Dispatch on both generic and namespaced channels
    const detail = {
      type,
      payload,
      widgetId, // Include widget ID for scoping
    };

    element.dispatchEvent(
      new CustomEvent(`widget-request`, {
        detail,
        bubbles: true, // Allow event to bubble up the DOM tree
        composed: true, // Allow event to cross shadow DOM boundaries
      })
    );
  });
}

/**
 * Public API functions (same across iframe & webcomponent)
 * Auto-detects platform (iframe or web component)
 */
export async function getContext() {
  // await initPlatform();
  return await connection?.getContext();
}

export async function getTheme() {
  // await initPlatform();
  return await connection?.getTheme();
}

export async function apiRequest(req: ApiRequestOptions) {
  // await initPlatform();
  return connection?.apiRequest(req);
}

/**
 * Subscribe to context changes (returns current value immediately if available)
 */
export async function getContextObservable(): Promise<PlatformObservable<any>> {
  await initPlatform();
  const context = await connection?.getContext();
  contextObservable = new PlatformObservable(context);
  return contextObservable!;
}

/**
 * Subscribe to theme changes (returns current value immediately if available)
 */
export async function getThemeObservable(): Promise<PlatformObservable<any>> {
  await initPlatform();
  const theme = await connection?.getTheme();
  themeObservable = new PlatformObservable(theme);
  return themeObservable!;
}

// Export the PlatformObservable class for type annotations
export { PlatformObservable };
