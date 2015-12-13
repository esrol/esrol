'use strict';
let expect = require('chai').expect;
let fs = require ('fs');
let path = require ('path');
let index = path.join(__dirname, '..', 'index.js');
let childProcess = require('child_process');
let command = 'node ' + index + ' --tests';
let cp = require('ncp');
let out = path.join(__dirname, 'out');

function removeSync(dir) {
  if( fs.existsSync(dir) ) {
    fs.readdirSync(dir).forEach((file) => {
      let curPath = dir + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        removeSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function onAppCreated(output) {
  let packageJson = path.join(out, 'package.json');
  describe('On app created in /test/out dir', () => {
    it('Output should be equal to "Happy Coding ^_^"', () => {
      expect(output.trim()).to.equal('Happy Coding ^_^');
    })
    it('package.json should exists', () => {
      let bool = fs.existsSync(packageJson);
      expect(bool).to.be.true;
    })
  })
}

if (fs.existsSync(out)) {
  removeSync(out);
}

describe('Esrol', () => {
  it('App should be created in /tests/out dir', (done) => {
    cp(path.join(__dirname, 'mocks'), __dirname, () => {
      let cmd = childProcess.exec(command);
      cmd.stdout.on('data', (r) => {
        onAppCreated(r);
        done();
      });
    })
  })
});
