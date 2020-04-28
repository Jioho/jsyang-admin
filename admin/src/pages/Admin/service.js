import { stringify } from 'qs';
import request from '@/utils/request';
export async function queryAdminList(params) {
  return request(`/server/api/admins?${stringify(params)}`);
}

export async function removeAdmin({ id }) {
  return request(`/server/api/admins/${id}`, {
    method: 'DELETE',
  });
}

export async function addAdmin(params) {
  return request('/server/api/admins', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateAdmin(params) {
  let { id, ...resultParams } = params;
  return request(`/server/api/admins/${id}`, {
    method: 'PUT',
    body: {
      ...resultParams,
    },
  });
}
