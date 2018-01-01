const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const walkDir = require('./walkDir');

const check = (f) => {
  if (Array.isArray(f)) {
    f.forEach(ff => check(ff));
  } else {
    const type = f.name.split('_')[0];
    fse.copySync(f.path, path.resolve(`${__dirname}/filtered/${type}/${f.name}`));
  }
}

let mapSticker = new Map();
let listFiles = walkDir.walkDirSync(__dirname + '/filtered/sticker')
listFiles = listFiles.map(file => {
  file.check = false;
  return file;
});
