import { stringify } from 'qs';
import request from '@/utils/request';

export async function changepasswd(params) {
  return request('/server/api/changepasswd', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
