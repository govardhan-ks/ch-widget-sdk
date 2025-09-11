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
 * Simple Observable implementation for platform data
 */
class PlatformObservable<T> {
  private observers: Set<(value: T) => void> = new Set();
  private _value: T | null = null;

  constructor(private initializer?: () => Promise<T>) {}

  subscribe(observer: (value: T) => void): () => void {
    this.observers.add(observer);
    
    // If we have a current value, emit it immediately
    if (this._value !== null) {
      observer(this._value);
    } else if (this.initializer) {
      // Initialize value if not yet loaded
      this.initializer().then(value => {
        this._value = value;
        this.observers.forEach(obs => obs(value));
      });
    }

    // Return unsubscribe function
    return () => {
      this.observers.delete(observer);
    };
  }

  next(value: T): void {
    this._value = value;
    this.observers.forEach(observer => observer(value));
  }

  get value(): T | null {
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

  

  if (window.self !== window.top) {
    // iframe case → Penpal
    const penpalConnection = await Penpal.connectToParent<PlatformAPI>({ 
      methods: {
        // ✅ Expose methods that parent can call directly
        updateTheme: (newTheme: any) => {
          console.log('🎨 Widget received theme update from parent:', newTheme);
          if (themeObservable) {
            themeObservable.next(newTheme);
          }
        },
        updateContext: (newContext: any) => {
          console.log('📝 Widget received context update from parent:', newContext);
          if (contextObservable) {
            contextObservable.next(newContext);
          }
        }
      }
    }).promise;
    connection = penpalConnection;
    setupObservables();
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
    setupObservables();
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
 * Setup observables for context and theme
 */
function setupObservables(): void {
  if (!connection) return;

  // Initialize context observable
  if (!contextObservable) {
    contextObservable = new PlatformObservable(() => connection!.getContext());
  }

  // Initialize theme observable
  if (!themeObservable) {
    themeObservable = new PlatformObservable(() => connection!.getTheme());

    // For web component case - listen for DOM events
    if (element && widgetId) {
      const themeChangeHandler = (e: Event) => {
        const custom = e as CustomEvent;
        if (custom.detail.widgetId === widgetId && custom.detail.type === 'themeChange') {
          themeObservable!.next(custom.detail.theme);
        }
      };
      element.addEventListener('widget-theme-change', themeChangeHandler as any);
    }
    // Note: For iframe case, updateTheme/updateContext methods are exposed 
    // in connectToParent and called directly by parent (no subscription needed)
  }
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
        element?.removeEventListener(`widget-response`, handler as any);
        resolve(custom.detail.data);
      }
    };

    element.addEventListener(`widget-response`, handler as any);

    // Dispatch on both generic and namespaced channels
    const detail = { 
      type, 
      payload, 
      widgetId // Include widget ID for scoping
    };

    element.dispatchEvent(new CustomEvent(`widget-request`, { 
      detail,
      bubbles: true,    // Allow event to bubble up the DOM tree
      composed: true    // Allow event to cross shadow DOM boundaries
    }));
  });
}

/**
 * Public API functions (same across iframe & webcomponent)
 * Auto-detects platform (iframe or web component)
 */
export async function getContext() {
  const api = await initPlatform();
  return contextObservable?.value ?? api.getContext();
}

export async function getTheme() {
  const api = await initPlatform();
  return themeObservable?.value ?? api.getTheme();
}

export async function apiRequest(req: ApiRequestOptions) {
  const api = await initPlatform();
  return api.apiRequest(req);
}

/**
 * Subscribe to context changes (returns current value immediately if available)
 */
export async function getContextObservable(): Promise<PlatformObservable<any>> {
  await initPlatform();
  return contextObservable!;
}

/**
 * Subscribe to theme changes (returns current value immediately if available)
 */
export async function getThemeObservable(): Promise<PlatformObservable<any>> {
  await initPlatform();
  return themeObservable!;
}

// Export the PlatformObservable class for type annotations
export { PlatformObservable };