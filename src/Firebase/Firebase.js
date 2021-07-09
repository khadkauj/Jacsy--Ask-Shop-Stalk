// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCswzyYaAcS5nDSvl7ybRRhuM1wZcyOCWc",
    authDomain: "jwork-4d8dc.firebaseapp.com",
    projectId: "jwork-4d8dc",
    storageBucket: "jwork-4d8dc.appspot.com",
    messagingSenderId: "556572034928",
    appId: "1:556572034928:web:c33f35bba235fe2401f1b5",
    measurementId: "G-2XSB9M96P3"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
    .catch(function (err) {
        if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
        }
    });



const db = firebaseApp.firestore();
const auth = firebase.auth()
// const storage = firebase.storage()
const provider = new firebase.auth.GoogleAuthProvider();
const microSoftAuthProvider = new firebase.auth.OAuthProvider('microsoft.com');
// analytics
const analytics = firebase.analytics()


export { provider, db, auth, microSoftAuthProvider, analytics }