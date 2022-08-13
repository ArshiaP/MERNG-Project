import React, { useContext } from 'react'
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton';

function PostCard({ post: { body, createdAt, id, username, likes, comments } }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const commentNumber = comments.length;

  function deletePost() {
    console.log('Delete Post');
  }

  function commentPost() {
    navigate(`/posts/${id}`);
  }

  return (
    <Card fluid >
      <Card.Content >
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton props={{id,likes}}/>
        <Button as='div' labelPosition='right' onClick={commentPost}>
          <Button color='blue' basic className='comments' >
            <Icon name='comments' />
          </Button>
          <Label basic color='blue' pointing='left' className='comments'>
            {commentNumber}
          </Label>
        </Button>
        {user && user.username === username && (
          <Button as="div" color="red" onClick={deletePost} floated="right">
            <Icon name='trash' style={{margin:0}}/>
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}

export default PostCard