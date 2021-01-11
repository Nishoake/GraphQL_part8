import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Importing Apollo/Client dependencies
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  console.log(`authLink = ${JSON.stringify(authLink.headers)}`)
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})



const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// Creating an ApolloClient object to pass into the ApolloProvider component
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
})

// Setting the context to the ApolloClient object
ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
)