import { queryGoodList, removeGood, addGood, updateGood } from './service';

export default {
  namespace: 'good',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGoodList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryGoodList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeGood : updateGood;
      } else {
        callback = addGood;
      }
      const res = yield call(callback, payload); // post
      const response = yield call(queryGoodList);
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
