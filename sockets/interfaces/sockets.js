'use strict';
module.exports = {
  interface: [
    {
      method: "init",
      arguments: ["server"]
    },
    {
      method: "handle",
      arguments: ["socket"]
    }
  ]
}; 