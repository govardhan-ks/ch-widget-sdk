import { Injectable, NgModule } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  apiRequest,
  ApiRequestOptions,
  initPlatform,
  getContextObservable,
  getThemeObservable,
} from 'widget-sdk-core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private _context$ = new BehaviorSubject<any>(null);
  private _theme$ = new BehaviorSubject<any>(null);
  private _initialized = false;

  async apiRequest(req: ApiRequestOptions) {
    return apiRequest(req);
  }

  /**
   * Initialize the platform service. Must be called before using observables.
   * For shadow DOM scenarios, pass the element.
   */
  async initialize(ctx?: { element?: HTMLElement }): Promise<void> {
    if (this._initialized) return;

    try {
      await initPlatform(ctx);

      // Subscribe to core observables
      const [contextObs, themeObs] = await Promise.all([
        getContextObservable(),
        getThemeObservable(),
      ]);

      // Subscribe to context changes
      contextObs.subscribe((context: any) => {
        this._context$.next(context);
      });

      // Subscribe to theme changes
      themeObs.subscribe((theme: any) => {
        this._theme$.next(theme);
      });

      this._initialized = true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Observable stream of context changes
   */
  get context$(): Observable<any> {
    return this._context$.asObservable();
  }

  /**
   * Observable stream of theme changes
   */
  get theme$(): Observable<any> {
    return this._theme$.asObservable();
  }

  /**
   * Get current context value
   */
  get currentContext(): any {
    return this._context$.value;
  }

  /**
   * Get current theme value
   */
  get currentTheme(): any {
    return this._theme$.value;
  }

  /**
   * Check if the service has been initialized
   */
  get isInitialized(): boolean {
    return this._initialized;
  }
}

@NgModule({
  providers: [PlatformService],
})
export class PlatformModule {}
