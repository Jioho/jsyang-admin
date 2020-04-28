const {firstUpperCase} = require('../../extend/helper')
const Inflector = require('inflected');
module.exports = packageName => {
  let PackageName = firstUpperCase(packageName)
  let packageNames = Inflector.pluralize(packageName);
  let result = `
  import { stringify } from 'qs';
  import request from '@/utils/request';
  export async function query${PackageName}List(params) {
    return request(\`/server/api/${packageNames}?\${stringify(params)}\`);
  }

  export async function remove${PackageName}({id}) {
    return request(\`/server/api/${packageNames}/\${id}\`, {
      method: 'DELETE',
    });
  }

  export async function add${PackageName}(params) {
    return request('/server/api/${packageNames}', {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  }

  export async function update${PackageName}(params) {
    let {id, ...resultParams} = params
    return request(\`/server/api/${packageNames}/\${id}\`, {
      method: 'PUT',
      body: {
        ...resultParams
      },
    });
  }
  `
  return result
}
