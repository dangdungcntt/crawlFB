const compareImages = require('resemblejs/compareImages');
const fs = require("fs");
const path = require('path')

const getDiff = async ({ path1, path2, file }) => {
  // The parameters can be Node Buffers
  // data is the same as usual with an additional getBuffer() function
  const fd1 = fs.openSync(path.resolve(path1), 'r');
  const fd2 = fs.openSync(path.resolve(path2), 'r');
  const data = await compareImages(
    fs.readFileSync(fd1),
    fs.readFileSync(fd2),
  );
  fs.closeSync(fd1);
  fs.closeSync(fd2);
  if (file) {
    file.rMP = data.rawMisMatchPercentage
    file.width = data.dimensionDifference.width
    return file
  }
  return data.rawMisMatchPercentage
}

getDiff({path1: '1.png', path2: '2.png'}).then(res => console.log(res))
