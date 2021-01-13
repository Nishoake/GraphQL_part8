import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  // Defining the state variables
  const [genre, setGenre] = useState(null)
  const [list, setList] = useState([])

  // The lazy query to execute allBooks
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)

  // Function passing in the 'genre' parameter for the allBooks query
  const getRecommendation = (genre) => {
    getBooks({ variables: { genre: genre}})
  }

  // Running the me query to get the favourite genre
  const user = useQuery(ME)

  // Fetching the me query's data
  useEffect(() => {
    if (user.data) {
      let favoriteGenre = user.data.me.favoriteGenre

      setGenre(favoriteGenre)
      getRecommendation(favoriteGenre)
    }
  }, [user.data]) // eslint-disable-line

  // Fetching the lazy query's data
  useEffect(() => {
    if (result.data) {
      setList(result.data.allBooks)
    }
  }, [result.data]) // eslint-disable-line


  // Conditional handling the useQuery
  if (!show) {
    return null
  } else if (user.loading) {
    return <div>loading...</div>
  } else if (user.error) {
    return <div>Error retrieving User data</div>
  }



  // RENDERING
  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favourite genre: <b>{genre}</b></p>

      <table>
        <tbody>
          <tr>
            <th>
              Title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {list.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}

export default Recommendations