import React from 'react'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {ALL_AUTHORS} from '../queries'
import { EDIT_AUTHOR } from '../mutations'

const Authors = (props) => {
  const [name, setName] = useState('')
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
      variables: { name, born: parseInt(born) }
    })

    console.log('updating author...')

    setName('')
    setBorn('')
  }

  if (!props.show) {
    return null
  } else if (authors.loading) {
    return <div>loading...</div>
  } else if (authors.error) {
    return <div>Error retrieving Author data</div>
  }

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
            name
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
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
