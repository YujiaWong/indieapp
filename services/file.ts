import { runApi } from './request';

export default {
  presignedUrl: (params: any) => runApi(`/v1/common/assets/upload/presigned-url?mimeType=${params.mimeType}`, {}, 'POST'),
}