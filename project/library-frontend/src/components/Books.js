import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  // Defining the state variables
  // Note: We need to define before the conditional
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [list, setList] = useState([])


  const books = useQuery(ALL_BOOKS)
  useEffect(() => {
    if (books.data){
      setList(books.data.allBooks)
    }
  }, [books.data]) // eslint-disable-line

  // Conditional handling the useQuery
  if (!show) {
    return null
  } else if (books.loading) {
    return <div>loading...</div>
  } else if (books.error) {
    return <div>Error retrieving Book data</div>
  }

  // Created set to save a unique set of genres
  let genresSet = new Set()
  books.data.allBooks.map(book => book.genres.map(genre => genresSet.add(genre)))

  //converted the genresSet into an array
  let uniqueGenres = [...genresSet]

  // event handler for filter
  const filterBooks = (genre) => {
    let shortList = books.data.allBooks.filter(book => book.genres.includes(genre))

    setSelectedGenre(genre)
    setList(shortList)
  }

  // event handler for All Genres
  const reset = () => {
    setList(books.data.allBooks)
    setSelectedGenre(null)
  }

  // RENDERING
    return (
      <div>
        <h2>books</h2>
        <p>In genre: <b>{selectedGenre}</b></p>

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
        {uniqueGenres.map(genre =>
          <button key={genre} type='button' onClick={() => filterBooks(genre)}>{genre}</button>
        )}
        <button type='button' onClick={() => reset()}>All Genres</button>
      </div>
    )

}

export default Books