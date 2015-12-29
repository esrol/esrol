'use strict';
let expect = require('chai').expect;
let fs = require ('fs');
let path = require ('path');
let index = path.join(__dirname, '..', 'index.js');
// specifically add test flag, otherwise the path will be wrong
let command = 'node ' + index + ' --tests';
let cp = require('ncp');
let out = path.join(__dirname, 'out');
require('mocha-sinon');

describe('', () => {
  beforeEach(function() { this.sinon.stub(console, 'log'); });
  it('App should be created in /tests/out dir', (done) => {
    if (fs.existsSync(out)) {
      removeSync(out);
    }
    cp(path.join(__dirname, 'mocks'), __dirname, () => {
      process.argv[2] = '--tests';
      require('../index');
      setTimeout(() => {
        onAppCreated('Happy Coding ^_^', 'exec');
        let Esrol = require('../lib/esrol');
        new Esrol(null, out);
        done();
      }, 200);
    });
  });
});

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

function getJsonFromFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

function onAppCreated(output, shouldExec) {

  let packageJson = path.join(out, 'package.json');
  describe('On app created in /test/out dir', () => {
    it('Output should be equal to "Happy Coding ^_^"', () => {
      expect(output.trim()).to.equal('Happy Coding ^_^');
    });
    it('package.json should exists', () => {
      let bool = fs.existsSync(packageJson);
      expect(bool).to.be.true;
    });
    it('package.json should have esrol installed config property set to true',
    () => {
      let json = getJsonFromFile(packageJson);
      expect(json.config.esrol.installed).to.be.true;
    });
    let should = `When esrol is installed for first time, the whole content in
      apps/server will be moved to the main directory (where "npm install esrol"
      was runned) and all of the dependencies are added to "package.json"`;
    it(should, (done) => {
      let dir = path.join(out, 'app', 'middlewares', 'http-middlewares');
      expect(fs.existsSync(dir)).to.be.true;
      removeSync(dir);
      expect(fs.existsSync(dir)).to.be.false;
      done();
    });
  });
}
