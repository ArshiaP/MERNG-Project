import React, { useState } from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import { useMutation } from '@apollo/client/react/hooks'
import gql from 'graphql-tag';
import {useNavigate} from 'react-router-dom'
import {FETCH_POSTS_QUERY} from '../pages/Home'


function DeleteButton({ postId }) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [ deletePost ] = useMutation(DELETE_POST, {
    variables: { postId },
    update(cache) {
      setConfirm(false);
      const data = cache.readQuery({
        query: FETCH_POSTS_QUERY
      })

      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter(p=>p.id!==postId)
        }
      });
      
      navigate('/');
      //remove post from cache
    }
  })

  return (
    <>
      <Button as="div" color="red" onClick={()=>setConfirm(true)} floated="right">
        <Icon name='trash' style={{ margin: 0 }} />
      </Button>
      <Confirm open={confirm} onCancel={() => setConfirm(false)} onConfirm={deletePost} />
    </>
  )
}

const DELETE_POST = gql`
 mutation deletePost($postId: ID!){
    deletePost(postId : $postId)
  }
`

export default DeleteButton