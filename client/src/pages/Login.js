import gql from 'graphql-tag';
import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client/react/hooks'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import { AuthContext } from "../context/auth"
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  /* result.data.login : {__typename: 'User', id: '62ea779eccc3d563a100b21c', email: 'shah@shah.com', username: 'shah', createdAt: '2022-08-03T13:26:54.061Z', …}
  createdAt: "2022-08-03T13:26:54.061Z"
  email: "shah@shah.com"
  id: "62ea779eccc3d563a100b21c"
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWE3NzllY2NjM2Q1NjNhMTAwYjIxYyIsImVtYWlsIjoic2hhaEBzaGFoLmNvbSIsInVzZXJuYW1lIjoic2hhaCIsImlhdCI6MTY1OTcwMDExMCwiZXhwIjoxNjU5NzAzNzEwfQ.zIhJO3omXmUwYl6MBMjyvA1AsWvmdsFU9_Q7HAdVKCY"
  username: "shah"
  __typename: "User" */


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
  if (!localStorage.getItem("token")) {
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
  else{
    return <Navigate to="/" replace />;
  }
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