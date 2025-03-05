import { runApi } from './request';

interface TPublistParams {
  username?:string;
  keyword?:string;
  sortField:string;
  asc:boolean;
  pageNum: number;
  pageSize: number;
}


interface chatHistoryQuery {
  cursor?: number;
  pageSize: number;
  projectCode: string;
  asc: boolean;
}

interface projectGeneralInfo {
  projectCode: string;
  title:string;
  description: string;
}

export default {
  create: () => runApi('/v1/projects/create', {}, 'post'),
  detail: (params: { projectCode: string }) =>
    runApi('/v1/projects/details', params, 'post'),
  artifacts: (params: { projectCode: string }) =>
    runApi('/v1/projects/contents/artifacts/query', params, 'post'),
  chatHistory: (params: chatHistoryQuery) =>
    runApi('/v1/projects/contents/chat-history/query', params, 'post'),
  remove: (params: { projectCodes: string[] }) =>
    runApi('/v1/projects/recycle', params, 'post'),
  publicArtifacts: (params: { projectCode: string }) =>
    runApi('/v1/comm/projects/artifacts/query', params, 'post'),
  list: (params: { pageNum: number; pageSize: number; workType?: string }) =>
    runApi('/v1/users/projects/mine', params, 'post'),
  pubList: (params: TPublistParams) =>
    runApi('/v1/comm/projects/query', params, 'post'),
  publish: (params: { projectCode: string; artifactSetCode: string }) =>
    runApi('/v1/comm/projects/publish', params, 'post'),
  publicationInfo: (params: { projectCode: String }) =>
    runApi('/v1/comm/projects/cur/pub/query', params, 'post'),
  projectDetails: (params: { projectCode: String }) =>
    runApi('/v1/comm/projects/details', params, 'post'),
  projectAttributes: (params: { projectCode: String }) =>
    runApi('/v1/comm/projects/attr/query', params, 'post'),
  switchPrivacy: (params: { projectCode: String; visibility: String }) =>
    runApi('/v1/comm/projects/visibility/switch', params, 'post'),
  homepageList: () => runApi('/v1/comm/projects/rec/query', {}, 'post'),
  editProjectInfo: (params: projectGeneralInfo) =>
    runApi('/v1/projects/infos/general/edit', params, 'post'),
  saveProject: (params: { projectCode: string }) =>
    runApi(
      `/v1/comm/projects/save?projectCode=${params.projectCode}`,
      {},
      'post'
    ),
  saveNum: (params: { projectCode: string }) =>
    runApi(`/v1/comm/projects/saved-num?projectCode=${params.projectCode}`,{},'post'),
};


