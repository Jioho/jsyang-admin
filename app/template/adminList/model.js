const {firstUpperCase} = require('../../extend/helper')
module.exports = packageName => {
  let PackageName = firstUpperCase(packageName)
  let result = `
  import { query${PackageName}List, remove${PackageName}, add${PackageName}, update${PackageName} } from './service';

  export default {
    namespace: '${packageName}',

    state: {
      list: [],
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(query${PackageName}List, payload);
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.list) ? response.list : [],
        });
      },
      *appendFetch({ payload }, { call, put }) {
        const response = yield call(query${PackageName}List, payload);
        yield put({
          type: 'appendList',
          payload: Array.isArray(response.list) ? response.list : [],
        });
      },
      *submit({ payload }, { call, put }) {
        let callback;
        if (payload.id) {
          callback = Object.keys(payload).length === 1 ? remove${PackageName} : update${PackageName};
        } else {
          callback = add${PackageName};
        }
        const res = yield call(callback, payload); // post
        const response = yield call(query${PackageName}List);
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

  `
  return result
}
