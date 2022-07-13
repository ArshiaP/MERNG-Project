const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const { SECRET } = require('../../config')
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

module.exports = {
  Mutation: {
    async register(_, { registerInput: { username, password, confirmPassword, email } }) {

      //Validate user data
      const {valid, errors } = validateRegisterInput(username, password, confirmPassword, email);
      if(!valid){
        throw new UserInputError('Errors',{errors});
      }
      //user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        //2nd argument is a payload
        //A payload in API is the actual data pack that is sent with the GET method in HTTP.
        throw new UserInputError('Username already exists!', {
          errors: {
            username: 'This username is already taken!'
          }
        });
      }

      //hash password
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      //jwt token
      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, SECRET, { expiresIn: '1h' });

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },

    async login(_,{loginInput : {username,password}}){
      const {valid,errors} = validateLoginInput(username,password);
      if(!valid){
        throw new UserInputError('Errors',{errors});
      }
      const user = await User.findOne({ username });
      if(!user){
        errors.general = 'User not found';
        throw new UserInputError('Wrong credentials', { errors })
      }
      const match  = await bcrypt.compare(password, user.password);
      if(!match) { 
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
      }, SECRET, { expiresIn: '1h' });

      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
}

//mutations take 4 params - parent,args,context,info 
//parent - result of last input(_ means no parent)
//args - all GraphQL arguments provided for this field.
//context -
//info - metadata 
