import React from 'react'
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
function PostCard({ post: { body, createdAt, id, username, likes, comments } }) {
  const likeNumber = likes.length;
  const commentNumber = comments.length;
  function likePost() {
    console.log('Like Post');
  }
  function commentPost() {
    console.log('Comment Post');
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
        <Button as='div' labelPosition='right' onClick={likePost}>
          <Button color='teal' basic >
            <Icon name='heart' /> 
          </Button>
          <Label basic color='teal' pointing='left'>
            {likeNumber}
          </Label>
        </Button>
        <Button as='div' labelPosition='right' onClick={commentPost}>
          <Button color='blue' basic className='comments' >
            <Icon name='comments' /> 
          </Button>
          <Label basic color='blue' pointing='left' className='comments'>
            {commentNumber}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  )
}

export default PostCard