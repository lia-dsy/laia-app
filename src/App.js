/*Extern libraries import*/
import React, { useRef, useState } from 'react';
import './App.css';

// import firebase, {getApps, initializeApp, firebaseConfig} from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
// import 'firebase/analytics';
import { auth } from './Components/firebaseConfig';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

/* Local modules import */

// Import audio play module
import * as audioPlay from "./modules/audioPlay.js";
// Import voice recognition module
// import * as voiceRecognition from "./modules/voiceRecognition.js";
// Import backend requests module
import * as backendRequests from "./modules/backendRequests.js";
// Import backend requests module
import * as mediaConverter from "./modules/mediaConverter.js";
//Components
import Login from './Components/Login/Login.js';
import ChatRoom from './Components/Chatroom/ChatRoom.js';
import AvatarBox from './Components/Avatar/AvatarBox.js';

// firebase.initializeApp({
//   // your config
//   apiKey: "AIzaSyC4tLPFncq5lZSOtYrCS0AvgpoCp79wKww",
//   authDomain: "laia-71c3c.firebaseapp.com",
//   projectId: "laia-71c3c",
//   storageBucket: "laia-71c3c.appspot.com",
//   messagingSenderId: "372171171545",
//   appId: "1:372171171545:web:856b208a2627b2c73cc0c8",
//   measurementId: "G-V632GRTLCB"
// })

// // Initialize Firebase
// if (!getApps().length) {
//   initializeApp(firebaseConfig);
// }

// const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();
const laiaPhotoURL = 'https://i.pinimg.com/1200x/56/88/c1/5688c185a4a0493e2c1f3d5cab0e5a78.jpg';
const laiaID = 'laia';
const audioFormat = 'audio/mp3';


function App() {

  const [user] = useAuthState(auth);

  return (
    <>
    {/* Probando para mostrar avatar */}
      {/* {user ? (
        <div className="Avatar">
          <ShowAvatar />
        </div>
        ) : null} */}

      <div>
        {
          !user ? (
            <Login />
          ) : (
            <div className='App'>
              <header>
                {/* <h1>LAIA</h1> */}
                <SignOut />
              </header>

            {/* <section> */}
              <ChatRoom />
              <AvatarBox />
        {/* </section> */}
      </div>
          )}
      </div>
    </>
  );
}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Cerrar Sesión</button>
  )
}


export default App;