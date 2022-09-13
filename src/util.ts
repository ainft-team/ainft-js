import stringify = require("fast-json-stable-stringify");
import { HttpMethod } from "./types";

export const buildData = (method: string, path: string, timestamp: number, data: any) => {
  if (method === HttpMethod.POST || method  === HttpMethod.PUT) {
    return {
      method,
      path,
      timestamp,
      body: stringify(data)
    }
  }

  return {
    method,
    path,
    timestamp,
    querystring: stringify(data)
  }
}