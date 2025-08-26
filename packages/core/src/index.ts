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

/**
 * Initialize core transport.
 * - If inside an iframe → use Penpal
 * - If standalone with custom element → use DOM events
 */
export async function initPlatform(ctx?: { element?: HTMLElement }) {
  if (connection) return connection;

  if (window.self !== window.top) {
    // iframe case → Penpal
    connection = await Penpal.connectToParent<PlatformAPI>({ methods: {} }).promise;
    return connection;
  }

  if (ctx?.element) {
    // WebComponent case → DOM CustomEvents
    element = ctx.element;
    connection = {
      getContext: () => requestFromElement("getContext"),
      getTheme: () => requestFromElement("getTheme"),
      apiRequest: (req: ApiRequestOptions) => requestFromElement("apiRequest", req),
    };
    return connection;
  }

  throw new Error("No valid platform transport found (iframe or element required)");
}

/**
 * DOM event request handler for WebComponent use case
 */
function requestFromElement<T = any>(type: string, payload?: any): Promise<T> {
  return new Promise((resolve) => {
    if (!element) throw new Error("Platform element not initialized");

    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail.type === `${type}Response`) {
        element?.removeEventListener("widget-response", handler as any);
        resolve(custom.detail.data);
      }
    };

    element.addEventListener("widget-response", handler as any);

    element.dispatchEvent(
      new CustomEvent("widget-request", {
        detail: { type, payload },
      })
    );
  });
}

/**
 * Public API functions (same across iframe & webcomponent)
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