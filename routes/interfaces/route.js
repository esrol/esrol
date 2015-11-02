'use strict';
module.exports = {
  isInterface: true,
  interface: [
    {
      method: 'getSingleRecord',
      arguments: ['req', 'res']
    },
    {
      method: 'getMultipleRecords',
      arguments: ['req', 'res']
    },    
  ]
};
