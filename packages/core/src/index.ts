import * as Penpal from "penpal";

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
 * Initialize core transport.
 * - If inside an iframe → use Penpal
 * - If web component detected → use DOM events with detected element
 * - If standalone with custom element → use DOM events
 */
export async function initPlatform(ctx?: { element?: HTMLElement }) {
  if (connection) return connection;

  // Dev fallback: if a global dev mock is present, use it
  const devMock = (globalThis as any).__WIDGET_SDK_DEV__ as PlatformAPI | undefined;
  if (devMock) {
    connection = devMock;
    return connection;
  }

  if (window.self !== window.top) {
    // iframe case → Penpal
    connection = await Penpal.connectToParent<PlatformAPI>({ methods: {} }).promise;
    return connection;
  }

  // Check if we're in a web component context
  const webComponentElement = ctx?.element;
  
  if (webComponentElement) {
    // WebComponent case → DOM CustomEvents
    element = webComponentElement;
    // Generate unique widget ID for this instance
    widgetId = generateWidgetId(webComponentElement);
    connection = {
      getContext: () => requestFromElement("getContext"),
      getTheme: () => requestFromElement("getTheme"),
      apiRequest: (req: ApiRequestOptions) => requestFromElement("apiRequest", req),
    };
    return connection;
  }

  throw new Error("No valid platform transport found (iframe or web component required)");
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
  return new Promise((resolve) => {
    if (!element || !widgetId) throw new Error("Platform element not initialized");

    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      // Only handle events for this specific widget instance
      if (custom.detail.widgetId === widgetId) {
        element?.removeEventListener(`widget-response-${widgetId}`, handler as any);
        resolve(custom.detail.data);
      }
    };

    element.addEventListener(`widget-response-${widgetId}`, handler as any);

    // Dispatch on both generic and namespaced channels
    const detail = { 
      type, 
      payload, 
      widgetId // Include widget ID for scoping
    };

    element.dispatchEvent(new CustomEvent(`widget-request-${widgetId}`, { detail }));
  });
}

/**
 * Public API functions (same across iframe & webcomponent)
 * Auto-detects platform (iframe or web component)
 */
export async function getContext() {
  const api = await initPlatform();
  return api.getContext();
}

export async function getTheme() {
  const api = await initPlatform();
  return api.getTheme();
}

export async function apiRequest(req: ApiRequestOptions) {
  const api = await initPlatform();
  return api.apiRequest(req);
}