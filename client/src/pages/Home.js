import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client/react/hooks';
import { Grid } from 'semantic-ui-react'
import PostCard from '../components/PostCard';
function Home() {
  const { loading, data} = useQuery(FETCH_POSTS_QUERY);
  if(data){
    var posts = data.getPosts;
  }
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          posts && posts.map(post => (
            <Grid.Column key={post.id} style={{marginBottom : 20}}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}

const FETCH_POSTS_QUERY = gql`
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