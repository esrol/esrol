'use strict';
module.exports = {  
  getHandle: function(app, type) {
    this.debug('Getting "socket" handles for type: "%s"', type);
    if (!app.sockets ||
     !app.sockets[type] || 
     typeof app.sockets[type].handle !== 'function' || 
     typeof app.sockets[type].init !== 'function') 
    {
      this.error('In order to consume %s sockets, you need to have "%s.js" file with "handle" and "init" methods, positioned into projectDir/sockets/ directory', type, type);
      process.exit(1);
    } 
    return {
      method: app.sockets[type].handle,
      scope: app.sockets[type]
    }
  }, 
}; 