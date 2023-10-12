const firebaseConfig = {
  apiKey: "AIzaSyDehBO1Mn18sQ21gybwFYSGsYJjIIkno7I",
  authDomain: "tournament-website-130cb.firebaseapp.com",
  projectId: "tournament-website-130cb",
  storageBucket: "tournament-website-130cb.appspot.com",
  messagingSenderId: "498386981089",
  appId: "1:498386981089:web:3cbf989f7f750fff9727a0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
db = firebase.database();

// User Authentication
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
  } else {
    console.log("No user signed in");
  }
});

// App Element
const app = document.getElementById("app");

// Render Pages

const renderHome = () => {
  console.log("rendering home");
  app.innerHTML = `
  <div id="homepage-container">
  <h1>Homepage</h1>
  <button id="create-tournament-btn">Create Tournament</button>
</div>
  `;
  document
    .getElementById("create-tournament-btn")
    .addEventListener("click", () => {
      renderCreateTournament();
    });
};

const renderLogin = () => {
  app.innerHTML = `<div id="login-container">
  <h1>Log in to Challenge</h1>
  <p>
    Welcome back! Please enter your details or log in with your social media
    account
  </p>

  <div class="social-login">
    <button class="discord">DISCORD</button>
    <button class="google">GOOGLE</button>
  </div>

  <div class="or-section">or</div>

  <div class="form-container">
    <input type="text" placeholder="Username or email" />
    <input type="password" placeholder="Password" />
    <div class="checkbox-container">
      <input type="checkbox" id="remember" />
      <label for="remember">Remember on this device</label>
    </div>
    <button class="login-btn">LOG IN</button>
  </div>
</div>`;
};

const renderSignup = () => {
  app.innerHTML = `<div id="signup-container" class="hidden">
  <h1>Sign up</h1>
  <p>
    Get started easily by signing up to manage your tournaments and events
  </p>
  <input type="text" id="email" placeholder="Email" />
  <input type="password" id="password" placeholder="Password" />
  <button id="signup-btn">SIGN UP</button>
</div>`;
  document.getElementById("signup-btn").addEventListener("click", () => {
    const email = $("#email").val();
    const password = $("#password").val();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const renderCreateTournament = () => {
  app.innerHTML = `    
  <div id="create-tournament-container">
    <h3>BASIC INFO</h3>
    <div id="create-tournament-form">
      <span
        ><label for="tournament-name">Tournament Name</label>
        <input type="text" id="tournament-name"
      /></span>
      <span>
        <label for="tournament-url">URL</label>
        <input type="text" id="tournament-url" />
      </span>
      <span>
        <label for="game">Game</label><input type="text" id="game" />
      </span>
      <span>
        <label for="description">Description</label>
        <input type="text" id="description" />
      </span>
    </div>
  </div>`;
};

// Event Listeners

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
});
