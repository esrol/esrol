'use strict';
module.exports = {
  interface: [
    {
      method: 'init',
      arguments: ["app", "middlewares"]
    },
    {
      method: 'onConnection',
      arguments: ["socket"]     
    },
    {
      method: 'runHandleInitMethod',
      arguments: ["app", "server"]      
    }, 
    {
      method: 'runSocketBasedMiddlewares',
      arguments: ["socket", "handle", "handleScope", "queue"]
    },
    {
      method: 'getProtocoloMiddlewares',
      arguments: ["app", "namespaces", "protocolType"]
    },
    {
      method: 'getHandle',
      arguments: ["app", "type"]
    }   
  ]
};
