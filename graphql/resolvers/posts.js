const Post = require('../../models/Posts');
const checkAuth = require('../../util/check-auth')
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      }
      catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post;
        } else {
          throw new Error('Post not found')
        }
      }
      catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      //checking if user is logged in
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
        user: user.id
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      //to check if the user deleting the post is the one who created it
      try {
        const post = await Post.findById(postId);
        if (post.username === user.username) {
          await post.delete();
          return 'Post deleted successfully'
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      }
      catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.username === user.username)) {
            //post already liked -> unlike it
            post.likes = post.likes.filter(like => like.username !== user.username)
            await post.save();
          } else {
            post.likes.push({
              username: user.username,
              createdAt: new Date().toISOString()
            })
            await post.save();
          }
          return post;
        } else {
          throw new UserInputError('Post not found')
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}