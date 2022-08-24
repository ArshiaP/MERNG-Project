const { ApolloServer} = require('apollo-server');
const { default: mongoose } = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
//dont need to specify index.js as it is in the index.js file

const { MONGODB } = require('./config.js');

const PORT = process.env.PORT || 4000;

// In GraphQL, a context is an object shared by all the resolvers of a specific execution. It's useful for keeping data such as authentication info, the current user, database connection, data sources and other things you need for running your business logic.

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req}) =>({req})
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
  .catch(err=>{
    console.log(err);
  })

//after login, change authorization header with the new token