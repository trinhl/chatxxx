'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
<<<<<<< HEAD
    //uri: 'mongodb://192.168.0.109/chatapp-dev'
    uri: 'mongodb://localhost/chatapp-dev'
=======
    uri: 'mongodb://0.0.0.0/chatapp-dev'
>>>>>>> a8861c0f07da329f51db2aaea75a298b8745efd8
  },

  // Seed database on startup
  seedDB: true

};
