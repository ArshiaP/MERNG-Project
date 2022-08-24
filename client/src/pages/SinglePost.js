import React, { useContext, useRef, useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { useParams } from 'react-router-dom';
import { Card, Grid, Image, Button, Label, Icon, Form, Loader} from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

function SinglePost() {

  const [commentContent, setCommentContent] = useState('');

  const { user } = useContext(AuthContext);
  const { postId } = useParams();

  const commentInputRef = useRef(null);
  console.log(postId);
  const { loading, data } = useQuery(GET_POST, {
    variables: { postId }
  })

  const [commentAdd] = useMutation(CREATE_COMMENT, {
    update() {
      setCommentContent('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: commentContent
    }
  })

  if (loading) {
    return (
      <div className='loading'>
        <Loader active inline='centered' />
      </div>
    )
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
                {user && user.username === username && (<DeleteButton postId={id} />)}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type="text"
                        placeholder='Comment'
                        name="comment"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        className='ui button teal'
                        type="submit"
                        disabled={commentContent === ''}
                        onClick={commentAdd}>Submit Comment</button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>
                    {comment.username}
                  </Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
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

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
  createComment(postId: $postId, body: $body) {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
  }
}
`

export default SinglePost