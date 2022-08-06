import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode';

const initialState ={
  user : null
}

/* decodedToken : {id: '62ea779eccc3d563a100b21c', email: 'shah@shah.com',
 username: 'shah', iat: 1659700009, exp: 1659703609}
email: "shah@shah.com"
exp: 1659703609
iat: 1659700009
id: "62ea779eccc3d563a100b21c"
username: "shah" */


if(localStorage.getItem("token")){
  const decodedToken = jwtDecode(localStorage.getItem("token"));
  if(decodedToken.exp *1000 < Date.now()){
    localStorage.removeItem("token");
  }else{
    initialState.user = decodedToken;
  }
}

//reducer takes curr state and action(which has type and payload if any)
//payload - data sent to change the state accordingly
//reducer modifies the state

const AuthContext = createContext()

function authReducer(state, action) {
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload
    }
  }
  else if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null
    }
  }
  else {
    return state;
  }
}

function AuthProvider(props) {
  //passing the reducer fn and the initial state
  const [state, dispatch] = useReducer(authReducer, initialState);

  //dispatch fn basically calls the reducer
  function login(userData) {
    localStorage.setItem("token", userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem("token");
    dispatch({
      type: 'LOGOUT'
    });
  }

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />

    //values are the data/functions you want to pass through all the components
  )
}

export {AuthContext, AuthProvider};