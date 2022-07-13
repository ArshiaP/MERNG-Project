const jwt = require('jsonwebtoken');
const {AuthenticationError} = require('apollo-server');
const {SECRET} = require('../config');

module.exports = (context) => {
  //getting token
  const authHeader = context.req.headers.authorization; 
  if(authHeader){
    const token = authHeader.split('Bearer ')[1];  
    if(token){
      try{
        const user=jwt.verify(token,SECRET);
        return user;
      }
      catch(err){
        throw new AuthenticationError('Invalid/Expired Token');
      }
    }
    else{
      throw new Error('Authentication token must be \'Bearer [token]');
    }
  }
  else{
    throw new Error('Authorization header must be provided');
  }
}

// Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema. The content of the header should look like the following:
