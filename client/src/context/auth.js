import React, { createContext, useReducer } from 'react'

const AuthContext = createContext()


//reducer takes curr state and action(which has type and payload if any)
//payload - data sent to change the state accordingly
//reducer modifies the state
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
  const [state, dispatch] = useReducer(authReducer, { user: null });

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