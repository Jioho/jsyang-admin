const xml2js = require('xml2js');
const Inflector = require('inflected');
module.exports = {
  json2xml(obj) {
    const builder = new xml2js.Builder({
      headless: true,
      allowSurrogateChars: true,
      rootName: 'xml',
      cdata: true
    });
    const xml = builder.buildObject(obj);
    return xml;
  },
  parseXml(xml) {
    const { parseString } = xml2js;
    let res;
    parseString(
      xml,
      {
        trim: true,
        explicitArray: false
      },
      function(err, result) {
        res = result;
      }
    );
    return res;
  },
  firstUpperCase(str) {
    return Inflector.camelize(str);
  },
  objStr2Obj(objStr){
    return JSON.parse(JSON.stringify(eval(`(${objStr})`)))
  },
  obj2ObjStr(obj){
    return JSON.stringify(obj).replace(/"([\w]+)":/g, '$1:')
  },
  parseInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
}
