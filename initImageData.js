const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const walkDir = require('./walkDir');
const ImgFac = require('./ImageFactory');

const initFilesData = ({ listFiles }) => new Promise(async (resolve, reject) => {
  let length = listFiles.length
  let unique = []

  let arrRes = [];
  while(listFiles.length > 0) {
    console.log("PAGING getDiff 500");
    arrRes = arrRes.concat(await Promise.all(listFiles.splice(0, 500).map(file => ImgFac.getDiff({ path1: path.resolve('base-face.png'), path2: file.path, file }))).catch(err => []))
  }
  console.log(arrRes)
  fs.writeFileSync('outFace.txt', JSON.stringify(arrRes));
  return

  
  resolve(unique);
})

let mapSticker = new Map();
let listFiles = walkDir.walkDirSync(__dirname + '/filtered/uniquedStickerFace')
listFiles = listFiles.map(file => {
  file.check = false;
  return file;
});

initFilesData({ listFiles })
  


