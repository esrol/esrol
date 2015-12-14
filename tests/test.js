'use strict';
let expect = require('chai').expect;
let fs = require ('fs');
let path = require ('path');
let index = path.join(__dirname, '..', 'index.js');
let childProcess = require('child_process');
// specifically add test flag, otherwise the path will be wrong
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

function getJsonFromFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

function onAppCreated(output) {
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
      was runned) and since all of the dependencies are added to "package.json",
      when we run "npm install" again, esrol should not move the whole content
      of apps/server again, which can cause adding removed
      files/directories or merging them. So we'll remove one directory from
      the installed app and will run the command again. directory
      "tests/out/app/middlewares/udpMiddlewares" should not exists`;
    it(should, (done) => {
      let dir = path.join(out, 'app', 'middlewares', 'udpMiddlewares');
      expect(fs.existsSync(dir)).to.be.true;
      removeSync(dir);
      expect(fs.existsSync(dir)).to.be.false;
      let cmd = childProcess.exec(command, () => {
        expect(fs.existsSync(dir)).to.be.false;
        done();
      });
    })
  })
}

if (fs.existsSync(out)) {
  removeSync(out);
}

describe('On post install Esrol', () => {
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
