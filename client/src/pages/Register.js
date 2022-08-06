import gql from 'graphql-tag';
import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client/react/hooks'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import { AuthContext } from "../context/auth"
import { Navigate, useNavigate } from "react-router-dom";

function Register(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({})
  const initalState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  const { onChange, onSubmit, values } = useForm(registerUser, initalState)
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      context.login(result.data.register)
      navigate('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })

  function registerUser() {
    addUser();
  };
  if (!localStorage.getItem("token")) {
    return (
      <div className='form-container'>
        <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
          <h1 className='page-title'>Register</h1>
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
            label="Email"
            placeholder="Email"
            name="email"
            error={errors.email ? true : false}
            value={values.email}
            onChange={onChange}
            type="email"
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
          <Form.Input
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
            type="password"
          />
          <Button type='submit' color='teal' className='button'>Register</Button>
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
  else {
    return <Navigate to="/" replace />
  }
}

const REGISTER_USER = gql`
  mutation register(
    $username:String!
    $email:String!
    $password:String!
    $confirmPassword:String!
  ){
    register(
      registerInput : {
        username : $username
        email : $email
        password : $password
        confirmPassword : $confirmPassword
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

export default Register