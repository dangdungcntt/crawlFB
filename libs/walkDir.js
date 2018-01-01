const fs = require('fs');
const path = require('path');
const walkDirSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkDirSync(path.join(d, f))) : { path: d, name: path.basename(d)};

module.exports = {
  walkDirSync
}
