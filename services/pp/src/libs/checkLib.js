const crypto = require('crypto');
'use srict'

let trim = (x) => {
  let value = String(x)
  return value.replace(/^\s+|\s+$/gm, '')
}
let isEmpty = (value) => {
  if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
    return true
  } else {
    return false
  }
}

let removeEmpty = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
  return obj;
};

let removeEmptyArr = arr => {
  let newArr = arr.filter((ar) => {
    return ar != null || undefined;
  });
  return newArr
}

let addslashes = (string) => {
  return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}

let changeKeyUpcaseArr = arr => {

  let obj = arr;

  Object.keys(obj).forEach(function (key) {
    var k = key.toUpperCase();
    if (k != key) {
      var v = obj[key]
      obj[k] = v;
      delete obj[key];

      if (typeof v == 'object') {
        changeKeyUpcaseArr(v);
      }
    }
  });

  return obj;
}

let checkObjectLen = arr => {
  return Object.keys(arr).length
}

let createMd5hash = (string) => {
  return crypto.createHash("md5").update(String(string)).digest('hex');
}

let buildquery = arr => {

  const urlParam = Object.keys(arr).map(key => {
    const arg = arr[key];
    if (arg != '') {
      return `${key}=${arg}`;
    }

  }).join('&');


  return new URLSearchParams(urlParam).toString();
}

let sortObj = obj => {

  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});

}

/**
 * exporting functions.
 */
module.exports = {
  trim: trim,
  isEmpty: isEmpty,
  removeEmpty: removeEmpty,
  removeEmptyArr: removeEmptyArr,
  addslashes: addslashes,
  changeKeyUpcaseArr: changeKeyUpcaseArr,
  checkObjectLen: checkObjectLen,
  createMd5hash: createMd5hash,
  buildquery: buildquery,
  sortObj: sortObj
}
