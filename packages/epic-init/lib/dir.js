const path = require('path');
const fse = require('fs-extra');

function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
}

function readAndCopyFileFromDirectory(pathDir, callback) {
  fse.copy(pathDir, '.', (err) => {
    if (err) console.error(err);
    callback();
  });
}

module.exports = {
  getCurrentDirectoryBase,
  readAndCopyFileFromDirectory,
};
