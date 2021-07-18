const firebase =  require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyD6QlmrF4eptSRUNUWodqlP3Hu7uuOh58Q",
    authDomain: "samarth-intern.firebaseapp.com",
    projectId: "samarth-intern",
    storageBucket: "samarth-intern.appspot.com",
    messagingSenderId: "117579355201",
    appId: "1:117579355201:web:c655bfcf95a29d1c2762c0",
    measurementId: "G-D97RSH55BY"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore()
// const auth = firebase.auth()

module.exports = db