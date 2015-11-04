'use strict';
module.exports = {
  interface: [
    {
      method: "router", 
      arguments: ["req", "res"]
    },    
    {
      method: "_runCluster", 
      arguments: []
    },
    {
      method: "_onServerCreated", 
      arguments: []
    },   

    // {
    //   method: "init", 
    //   arguments: []
    // },        
  ]
};
