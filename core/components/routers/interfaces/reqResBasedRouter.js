'use strict';
module.exports = {
  interface: [
    {
      method: 'init',
      arguments: []
    },
    {
      method: 'router',
      arguments: ['req', 'res']
    },
    {
      method: '_dispatchRequest',
      arguments: ['req', 'res', 'url', 'method']
    },
    {
      method: '_getMiddlewares',
      arguments: []
    },
    {
      method: '_getRoutes',
      arguments: []
    },
    {
      method: '_getMiddlewaresAndRoutes',
      arguments: []
    }                     
  ]
};
