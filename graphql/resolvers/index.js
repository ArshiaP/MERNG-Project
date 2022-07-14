const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  //a modifier - when any query or mutation returns a post, it will go through this modifier and apply these modifications
  Post:{
    likeCount : (parent) => {
      return parent.likes.length
    },
    commentCount : (parent) => {
      return parent.comments.length
    }
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  }
}