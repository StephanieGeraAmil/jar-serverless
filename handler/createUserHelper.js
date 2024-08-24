"use strict";
const { v4: uuidv4 } = require('uuid');

module.exports.createUser = ({ email }) => {
  return {
    id: uuidv4(),
    email: email, // Assign email as a string
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
