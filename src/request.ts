/* lib */
import * as Util from './util';
import { Method, ErrorResponse } from './types';

const request = async <T>(method: Method = 'GET', url: string = '', params: any = {}, data?: any): Promise<T | ErrorResponse> => {
  const uri = url
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');

  const options: { method: string, headers: { [key: string]: string; }, body?: any } = {
    method,
    headers: {
      Authorization: Util.createHeaderString(params),
    },
  };
  if (!!data) {
    options.headers["Content-Type"] = 'multipart/form-data';
    options.body = data;
  }

  const response = await fetch(uri, options);

  const contentType = response.headers.get('content-type');

  /* json */
  if (contentType && contentType.indexOf('application/json') !== -1) {
    const result = await response.json();

    return result;
  }

  /* encoded */
  const result = await response.text();

  return Util.parseFormEncoding(result);
};

export default request;
