const { gql } = require('apollo-server');

module.exports = gql`
  type Post{
    id:ID!
    body:String!
    createdAt:String!
    username:String!
    comments:[Comment!]!
    likes:[Like!]!
    likeCount: Int!
    commentCount: Int!
  }
  type User {
    id:ID!
    email:String!
    token:String!
    username:String!
    createdAt:String!
  }
  type Comment{
    id:ID!
    createdAt:String!
    username:String!
    body:String!
  }
  type Like{
    id:ID!
    createdAt:String!
    username:String!
  }
  input RegisterInput{
    username:String!
    password:String!
    confirmPassword:String!
    email:String!
  }
  input LoginInput{
    username:String!
    password:String!
  }
  type Query{
    getPosts:[Post]
    getPost(postId: ID!) : Post
  }
  type Mutation{
    register(registerInput: RegisterInput) : User!
    login(loginInput: LoginInput) : User!
    createPost(body: String!) : Post!
    deletePost(postId: ID!): String!
    createComment(postId:ID!,body:String!) : Post!
    deleteComment(postId:ID!,commentId:ID!) : Post!
    likePost(postId: ID!):Post!
  }
`;

//register - arbitrary name of the mutation
//() - has the params
//: x --- x is the return value