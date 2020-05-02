import { stringify } from 'qs';
import request from '@/utils/request';
export async function queryStudentList(params) {
  return request(`/server/api/students?${stringify(params)}`);
}

export async function removeStudent({ id }) {
  return request(`/server/api/students/${id}`, {
    method: 'DELETE',
  });
}

export async function addStudent(params) {
  return request('/server/api/students', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateStudent(params) {
  let { id, ...resultParams } = params;
  return request(`/server/api/students/${id}`, {
    method: 'PUT',
    body: {
      ...resultParams,
    },
  });
}
