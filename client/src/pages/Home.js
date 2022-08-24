import React, { useContext } from 'react'
import { useQuery } from '@apollo/client/react/hooks';
import { Grid, Transition, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm';
import gql from 'graphql-tag';

function Home() {
  const { user } = useContext(AuthContext)
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  if (data) {
    var posts = data.getPosts;
  }
  return (
    <Grid stackable columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
           <Loader active inline='centered' />
        ) : (
          <Transition.Group>
            {posts && posts.map(post => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    id
    body
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
    createdAt
  }
}
`

export default Home