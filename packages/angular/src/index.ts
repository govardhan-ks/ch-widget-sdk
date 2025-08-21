import { Injectable, NgModule } from "@angular/core";
import {
  getUser,
  getSettings,
  getCommunity,
  applyThemeVariables,
  fetchPlatformData,
} from "widget-sdk-core";

@Injectable({ providedIn: "root" })
export class PlatformService {
  async getUser() { return getUser(); }
  async getSettings() { return getSettings(); }
  async getCommunity() { return getCommunity(); }
  async applyThemeVariables(vars: Record<string,string>) { return applyThemeVariables(vars); }
  async fetchPlatformData(endpoint: string, options?: any) { return fetchPlatformData(endpoint, options); }
}

@NgModule({
  providers: [PlatformService],
})
export class PlatformModule {}