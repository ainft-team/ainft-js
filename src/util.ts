import stringify = require("fast-json-stable-stringify");
import { HttpMethod } from "./types";

export const buildData = (method: string, path: string, timestamp: number, data: any) => {
  const _data: any = {
    method,
    path,
    timestamp
  }

  if (Object.keys(data).length === 0) {
    return _data;
  } 

  if (method === HttpMethod.POST || method  === HttpMethod.PUT) {
    _data['body'] = stringify(data);
  } else {
    _data['querystring'] = stringify(data);
  }

  return _data;
}