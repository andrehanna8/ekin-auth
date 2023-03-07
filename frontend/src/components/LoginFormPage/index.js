import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignupFormModal from '../SignupFormModal';
import './LoginForm.css';
// import sessionReducer from '../../store/session';

function LoginFormPage({setShowForm, setShowLoginForm}) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        let data;
        try {
          // .clone() essentially allows you to read the response body twice
          data = await res.clone().json();
        } catch {
          data = await res.text(); // Will hit this case if the server is down
        }
        if (data?.errors) setErrors(data.errors);
        else if (data) setErrors([data]);
        else setErrors([res.statusText]);
      });
  }

  const hideModal = (e) => {
    e.preventDefault()
    setShowLoginForm(false)
  }

  const keepModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const showSignUpForm = (e) => {
    e.preventDefault()
    setShowForm(true)
    setShowLoginForm(false)
    return (
      <> 
        <SignupFormModal />
      </>
    )
  }

  return (
    <div className="modal-wrapper" onClick={hideModal}>
      <form className="form-control" onSubmit={handleSubmit} onClick={keepModal}>
      <button className="close-button" onClick={hideModal}> <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-512.png"/> </button>
        <h2 id="join-nike-now-header"> WELCOME BACK</h2>
        <ul>
          {errors.map(error => <li key={error}>{error}</li>)}
        </ul>
        <label>
          
          <input
            className='input-field'
            placeholder="Email or Username"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          
          <input
            className='input-field'
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className='signup-button' type="submit" onClick={handleSubmit}>Log In</button>
        <p>Don't have an account?  <button onClick={showSignUpForm} >Sign Up</button></p>

      </form>
    </div>
  );
}

export default LoginFormPage;