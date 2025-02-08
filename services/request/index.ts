import { extend, RequestOptionsInit } from 'umi-request';
import { HttpError, SystemError } from './error-type';
import { errorHandler } from './error-handler';

export const request = extend({
  prefix: '/api',
  credentials: 'include',
  errorHandler,
  headers: {
    'x-use-external-api': 'true'
  }
});
/**
 * 请求拦截
 */
request.interceptors.request.use(
  (url, options: any) => {
    const token = localStorage.getItem('token');
    // 如果有 token，将其添加到请求头
    const headers = {
      ...options.headers,
    };

    if (token && token !== 'undefined') {
      headers.Authorization = `Bearer ${token}`;
    } 

    return {
      url,
      options: {
        ...options,
        headers
      },
    };
  },
  {
    global: false,
  },
);


/**
 * 响应拦截
 */
request.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const token = response.headers.get('token'); // 假设 token 在 'Authorization' 头部
      if (token) {
        localStorage.setItem('token', token);
      }
      return response
        .clone()
        .json()
        .then(responseJson => {
            if (responseJson.suc) {
              return responseJson;
            } else {
              // 登录失效
              if (responseJson.code === 3000){
                if (!response.url.includes('/v1/users/infos/mine')) {
                  window.dispatchEvent(new CustomEvent('SkipLogin'));
                }
                localStorage.setItem('token', '');
                return;
              }
              throw new SystemError(responseJson.msg, responseJson.code, responseJson);
            }
        });
    } else {
      throw new HttpError('', response.status);
    }
  },
  {
    global: false,
  },
);


export const runApi = async <ApiParams extends object | URLSearchParams | undefined>(
  api: string,
  params?: ApiParams,
  method = 'get'
) => {
  const options: Partial<RequestOptionsInit> = { method };
  const type = method.toUpperCase();

  if (type === 'GET')  {
    options.params = params;
  } else if (type === 'POST') {
    options.data = params;
  }

  return request(api, options);
};
