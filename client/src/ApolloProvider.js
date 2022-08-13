import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client'
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

const setAuthorizationLink = setContext((request, previousContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: { authorization: token? `Bearer ${token}`: ''}
  }
});

const client = new ApolloClient({
  link: setAuthorizationLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)