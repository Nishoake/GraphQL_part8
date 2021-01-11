import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
// import {  } from '../queries'
import { LOGIN } from '../mutations'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      console.log(`Login token = ${token}`)

      setToken(token)
      localStorage.setItem('library-user-token', token)

      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line
  
  const submit = async event => {
    event.preventDefault()
    console.log(`username = ${username}`)
    console.log(`password = ${password}`)

    login({ variables: { username, password } })

    setUsername('')
    setPassword('')
    console.log('attempting to login from Login.js')
  }

  if(!show){
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          name<input 
            value={username} 
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password<input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm