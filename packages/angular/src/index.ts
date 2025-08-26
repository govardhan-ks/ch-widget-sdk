import { Injectable, NgModule } from "@angular/core";
import {
  getContext,
  getTheme,
  apiRequest,
  ApiRequest,
  initPlatform,
} from "widget-sdk-core";

@Injectable({ providedIn: "root" })
export class PlatformService {
  async getContext() { return getContext(); }
  async getTheme() { return getTheme(); }
  async apiRequest(req: ApiRequest) { return apiRequest(req); }
  async initPlatform(ctx?: { element?: HTMLElement }) { return initPlatform(ctx); }
}

@NgModule({
  providers: [PlatformService],
})
export class PlatformModule {}