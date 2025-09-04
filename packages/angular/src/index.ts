import { Injectable, NgModule } from "@angular/core";
import {
  getContext,
  getTheme,
  apiRequest,
  ApiRequestOptions,
  initPlatform,
} from "widget-sdk-core";


@Injectable({ providedIn: "root" })
export class PlatformService {
  async getContext() { return getContext(); }
  async getTheme() { return getTheme(); }
  async apiRequest(req: ApiRequestOptions) { return apiRequest(req); }
  async initPlatform(ctx?: { element?: HTMLElement }) { return initPlatform(ctx); }
}

@NgModule({
  providers: [PlatformService],
})
export class PlatformModule {}