import { queryStudentList, removeStudent, addStudent, updateStudent } from './service';

export default {
  namespace: 'student',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStudentList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryStudentList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeStudent : updateStudent;
      } else {
        callback = addStudent;
      }
      const res = yield call(callback, payload); // post
      const response = yield call(queryStudentList);
      yield put({
        type: 'queryList',
        payload: response.list,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
