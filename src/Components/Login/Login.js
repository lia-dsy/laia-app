import React, {useState} from 'react';
import './Login.css';
import { Icon } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const Login = () =>{ 
  // const [userValue, setUserValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const signInWithGoogle = () => {
    // Make sure firebase is properly initialized and available in your project
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        console.log('Google Sign-In successful:', result.user);
      })
      .catch((error) => {
        console.error('Error during Google Sign-In:', error);
      });
  };

  const logIn = (e) => {
    e.preventDefault();
    console.log('Log in');
    // console.log('User:', userValue);
    console.log('Email:', emailValue);
    console.log('Password:', passwordValue);

    // Reset form values
    // setUserValue('');
    setEmailValue('');
    setPasswordValue('');
  };

  return (
    <div className='wrapper'>
      <form onSubmit={logIn}>
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} required />
          <Icon name='user' className='icon'/>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Contraseña" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} required />
          <Icon name='lock' className='icon'/>
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button className="sign-in" type="submit" disabled={!emailValue || !passwordValue} >Login</button>
        <button className="sign-in" onClick={signInWithGoogle}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt='Google icons created by Freepik - Flaticon'
              className="google-icon"
            />
            <span>Ingresa con Google</span>
        </button>
        <div className="regiser-link">
          <p>No tienes cuenta?</p>
          <a href="#">Registrarse</a>
        </div>
      </form>
     
    </div>
  )
}





export default Login;