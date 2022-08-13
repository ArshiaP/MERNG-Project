import React, { useContext, useEffect, useState } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { useMutation } from '@apollo/client/react/hooks'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'

function LikeButton({ props: { id, likes } }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const likeNumber = likes.length;

  const [likePost, { error }] = useMutation(LIKE_POST, {
    variables: { postId: id },

  })

  const likedButton = user ? (
    liked ? (
      <Button color='teal' >
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic >
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button color='teal' basic as={Link} to='/login' >
      <Icon name='heart' />
    </Button>
  )

  return (
    <>
      <Button as='div' labelPosition='right' onClick={likePost}>
        {likedButton}
        <Label basic color='teal' pointing='left'>
          {likeNumber}
        </Label>
      </Button>
    </>
  )
}

const LIKE_POST = gql`
 mutation likePost($postId: ID!){
  likePost( postId : $postId){
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

export default LikeButton