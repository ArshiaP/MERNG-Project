import gql from 'graphql-tag';
import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client/react/hooks'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import {AuthContext} from "../context/auth"
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data.login);
      navigate('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })
  function loginUserCallback() {
    loginUser();
  };

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
        <h1 className='page-title'>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
          type="text"
        />

        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
          type="password"
        />

        <Button type='submit' color='teal' className='button'>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username:String!
    $password:String!
  ){
    login(
      loginInput : {
        username : $username
        password : $password
      }
    ){
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login;