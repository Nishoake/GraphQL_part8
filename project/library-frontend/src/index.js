import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Importing Apollo/Client dependencies
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'

// Creating an ApolloClient object to pass into the ApolloProvider component
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

// Setting the context to the ApolloClient object
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)