import * as Penpal from "penpal";

export interface FetchOpts {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface PlatformAPI {
  getUser(): Promise<{ id: string; name: string; role: string }>;
  getSettings(): Promise<Record<string, any>>;
  getCommunity(): Promise<{ id: string; name: string }>;
  applyThemeVariables(vars: Record<string, string>): void;
  fetchPlatformData(endpoint: string, options?: FetchOpts): Promise<any>;
}

let connection: PlatformAPI | null = null;

async function connect(): Promise<PlatformAPI> {
  if (connection) return connection;
  connection = await Penpal.connectToParent<PlatformAPI>({ methods: {} }).promise;
  return connection;
}

export async function getUser() { return (await connect()).getUser(); }
export async function getSettings() { return (await connect()).getSettings(); }
export async function getCommunity() { return (await connect()).getCommunity(); }
export async function applyThemeVariables(vars: Record<string,string>) {
  return (await connect()).applyThemeVariables(vars);
}
export async function fetchPlatformData(endpoint: string, options?: FetchOpts) {
  return (await connect()).fetchPlatformData(endpoint, options);
}