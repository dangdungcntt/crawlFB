const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const walkDir = require('./libs/walkDir');

const check = (f) => {
  if (Array.isArray(f)) {
    f.forEach(ff => check(ff));
  } else {
    const type = f.name.split('_')[0];
    fse.copySync(f.path, path.resolve(`${__dirname}/filtered/${type}/${f.name}`));
  }
}

check(walkDir.walkDirSync(__dirname + '/downloaded'))
