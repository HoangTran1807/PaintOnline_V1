import Mainboard from './Components/MainBoard'
import CanvasBoard from './Components/CanvasBoard'
import CanvasBoard_V2 from './Components/CanvasBoard_V2';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp3RU59hut_ZFdbzAoMGLnwM36e9kqUO4",
  authDomain: "paintonline-51687.firebaseapp.com",
  projectId: "paintonline-51687",
  storageBucket: "paintonline-51687.appspot.com",
  messagingSenderId: "927269435040",
  appId: "1:927269435040:web:5e8c838c93c629b408fbc5",
  measurementId: "G-S6TYY7B6QG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      <CanvasBoard />
    </div>
  );
}

export default App;
