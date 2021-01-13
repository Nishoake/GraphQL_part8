import {gql} from '@apollo/client'

export const ALL_AUTHORS = gql`
  query{
    allAuthors{
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query findBook($genre: String){
    allBooks(
      genre: $genre
    ){
      title
      published
      genres
      author{
        name
      }
    }
  }
`

export const ME = gql`
  query{
    me{
      username,
      favoriteGenre
    }
  }
`