import React, { useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { useMutation } from '@apollo/client/react/hooks'
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom'
import { FETCH_POSTS_QUERY } from '../pages/Home'


function DeleteButton({ postId, commentId }) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

  const [deletePostOrComment, { error }] = useMutation(mutation, {
    variables: { postId, commentId },
    update(cache) {
      console.log(commentId);
      setConfirm(false);
      if (!commentId) {
        const data = cache.readQuery({
          query: FETCH_POSTS_QUERY
        })
        cache.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter(p => p.id !== postId)
          }
        });
        navigate('/');
      }
    }
  })

  console.log(error);

  return (
    <>
      <Popup
        content={commentId ? "Delete comment" : "Delete Post"}
        inverted
        trigger={
          <Button as="div" color="red" onClick={() => setConfirm(true)} floated="right">
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        } />
      <Confirm open={confirm} onCancel={() => setConfirm(false)} onConfirm={deletePostOrComment} />
    </>
  )
}

const DELETE_POST = gql`
 mutation deletePost($postId: ID!){
    deletePost(postId : $postId)
  }
`

const DELETE_COMMENT = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
  deleteComment(postId: $postId, commentId: $commentId) {
    id
    body
    createdAt
    comments {
      id
      createdAt
      username
      body
    }
    username
    likes {
      id
      createdAt
      username
    }
  }
}
`

export default DeleteButton