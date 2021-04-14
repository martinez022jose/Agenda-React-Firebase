import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBbENfAMibKsRFLPcK3j7DLZyPraefUhGE",
    authDomain: "agenda-react-firebase.firebaseapp.com",
    projectId: "agenda-react-firebase",
    storageBucket: "agenda-react-firebase.appspot.com",
    messagingSenderId: "127641637097",
    appId: "1:127641637097:web:86a35c80f1d94fb7956078"
  };


  const fireb = firebase.initializeApp(firebaseConfig);
  const store = fireb.firestore();

  export { store };