// global.d.ts

import { Server } from "http";

declare global {
  var __SERVER__: Server;
}

export {};

declare global {
  var testServer: import("http").Server | undefined;
}

export {};
