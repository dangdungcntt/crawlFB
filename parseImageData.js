const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const ImgFac = require('./libs/ImageFactory');

let arrRes = JSON.parse(fs.readFileSync('out.txt'));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out1.txt')));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out2.txt')));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out3.txt')));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out4.txt')));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out5.txt')));
arrRes = arrRes.concat(JSON.parse(fs.readFileSync('out6.txt')));

console.log(arrRes.length)


const run = async ({ arrRes }) => {

  let length = arrRes.length
  let unique = []
  for (let i = 0; i < length; i++) {
    let file = arrRes[i];

    if (file.check) continue;

    let same = 0
    console.log('CALCULATING ' + i + " " + file.name);
    for (let j = i + 1; j < length; j++) {
      if (file.rMP == arrRes[j].rMP) {
        console.log("WIDTH " + file.width);
        same++;
        arrRes[j].check = true
      }
    }
    file.same = same;
    unique.push(file);
  }
  let cur = 0;
  let total = unique.length
  unique.forEach(file => {
    arrName = file.name.split('_')
    arrName = arrName.slice(1, arrName.length);
    file.name = arrName.join('_');
    fse.copySync(file.path, path.resolve(`${__dirname}/filtered/uniquedSticker/${file.same}_${file.name}`));
    console.log(`COPYED ${++cur}/${total}`);
  })
}

// run({ arrRes })
