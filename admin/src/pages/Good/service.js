import { stringify } from 'qs';
import request from '@/utils/request';
export async function queryGoodList(params) {
  return request(`/server/api/goods?${stringify(params)}`);
}

export async function removeGood({ id }) {
  return request(`/server/api/goods/${id}`, {
    method: 'DELETE',
  });
}

export async function addGood(params) {
  return request('/server/api/goods', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateGood(params) {
  let { id, ...resultParams } = params;
  return request(`/server/api/goods/${id}`, {
    method: 'PUT',
    body: {
      ...resultParams,
    },
  });
}
