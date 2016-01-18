'use strict';
let App = require('esrol-server-app');
let path = require('path');
new App(path.join(__dirname, 'app'), () => {
  console.log ('Server(s) are listening and startup is finished.');
});
