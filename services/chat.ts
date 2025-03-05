import { runApi } from './request';

interface TPublistParams {
  pageNum: number;
  pageSize: number;
  workType: string;
}

interface historyParams {
  cursor: number;
  pageSize: number;
  asc: boolean;
  projectCode: string;
}



export default {
  history: (params: historyParams) => runApi('/v1/projects/contents/chat-history/query', params, 'post'),
}


