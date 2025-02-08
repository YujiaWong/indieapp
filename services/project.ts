import { runApi } from './request';

interface TPublistParams {
  pageNum: number;
  pageSize: number;
}

interface chatHistoryQuery {
  cursor?: number;
  pageSize: number;
  projectCode: string;
  asc: boolean;
}

export default {
  create: () => runApi('/v1/projects/create', {}, 'post'),
  detail: (params: { projectCode: string }) => runApi('/v1/projects/detail', params, 'post'),
  artifacts: (params: { projectCode: string }) => runApi('/v1/projects/contents/artifacts/query', params, 'post'),
  chatHistory: (params: chatHistoryQuery) => runApi('/v1/projects/contents/chat-history/query', params, 'post'),
  remove: (params: { projectCodes: string[] }) => runApi('/v1/projects/recycle', params, 'post'),
  publicArtifacts: (params: { projectCode: string }) => runApi('/v1/projects/contents/artifacts/public/query', params, 'post'),
  list: (params: { pageNum: number; pageSize: number; workType?: string }) => runApi('/v1/users/projects/query', params, 'post'),
  pubList: (params: TPublistParams) => runApi('/v1/projects/public/query', params, 'post'),
}


