import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client/react/hooks'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../pages/Home'

function PostForm() {

  const { onChange, onSubmit, values } = useForm(createCallback, {
    body: ''
  });

  //https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly
  const [create, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(cache, result) {
      const data = cache.readQuery({
        query: FETCH_POSTS_QUERY
      })

      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts]
        }
      });
      console.log(result);
      values.body='';
    }
  })

  function createCallback() {
    create();
  };
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Body"
            name="body"
            onChange={onChange}
            value={values.body}
            error = {error ? true : false}
          />
          <Button type="submit" color="teal">Submit</Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{marginBottom:20}}>
          <p>{error.graphQLErrors[0].message}</p>
        </div>
      )}
    </>
  )
}

const CREATE_POST = gql`
  mutation createPost(
    $body:String!
  ){
    createPost(
      body:$body
    ){
      id
      body
      createdAt
      username
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`

export default PostForm