import React, { useContext } from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client/react/hooks';
import { useParams } from 'react-router-dom';
import { Card, Grid, Image, Button, Label, Icon } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

function SinglePost() {
  const {user} = useContext(AuthContext);
  const { postId } = useParams();
  console.log(postId);
  const { loading, data } = useQuery(GET_POST, {
    variables: { postId }
  })
  if (loading) {
    return (<><p>Loading...</p></>)
  }
  else {
    const { id, body, createdAt, comments, username, likes } = data.getPost;
    const commentNumber = comments.length;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton props={{ id, likes }} />
                <Button as='div' labelPosition='right' onClick={() => console.log("Comment")}>
                  <Button color='blue' basic className='comments' >
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left' className='comments'>
                    {commentNumber}
                  </Label>
                </Button>
                {user && user.username === username && (<DeleteButton postId={id}/>)}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const GET_POST = gql`
 query getPost($postId: ID!){
    getPost(postId : $postId){
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

export default SinglePost