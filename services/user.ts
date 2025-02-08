import { runApi } from './request';

export default {
  login: (params: any) => runApi(`/login?username=${params.username}&password=${params.password}`, params, 'post'),
  googleLogin: (params?: any) => runApi('/oauth2/authorization/google', params, 'post'),
  githubLogin: (params?: any) => runApi('/oauth2/authorization/github', params, 'post'),
  register: (params: any) => runApi('/v1/users/account/register', params, 'post'),
  query: (params: any) => runApi('/v1/users/projects/query', params, 'post'),
  infos: () => runApi('/v1/users/infos/mine', {}, 'post'),
  update: (params: any) => runApi('/v1/users/infos/general/edit', params, 'post'),
  // 我的项目
  projects: (params: any) => runApi('/v1/users/projects/query', params, 'post')
}