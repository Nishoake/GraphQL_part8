import React from 'react'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {ALL_AUTHORS} from '../queries'
import { EDIT_AUTHOR } from '../mutations'
import Select from 'react-select'

const Authors = ({ show, token }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const authors = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = async (event) => {
    event.preventDefault()

    console.log(`name: ${name}`)
    console.log(`born: ${born}`)

    await editAuthor({
      variables: { name: name.value, born: parseInt(born) }
    })

    console.log('updating author...')

    setName('')
    setBorn('')
  }

  if (!show) {
    return null
  } else if (authors.loading) {
    return <div>loading...</div>
  } else if (authors.error) {
    return <div>Error retrieving Author data</div>
  } else if (!token) {
    console.log(`the token is: ${token}`)
    return (
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
            </th>
              <th>
                books
            </th>
            </tr>
            {authors.data.allAuthors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
  
  // Show the Edit Author functionality if user is logged in
  // Callback function to create authors object for the options array
  const asObject = (author) => {
    return {
      value: author.name,
      label: author.name
    }
  }

  // setting the options variable to an array of author objects 
  // by running the map method with the asObject callback function
  // Reminder that we are using react-select component to select author to edit
  const options = authors.data.allAuthors.map(asObject)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            defaultValue={name}
            onChange={setName}
            options={options}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>

    </div>
  )
}

export default Authors
