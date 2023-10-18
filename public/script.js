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

// Global Variables
let loggedInPerson = null;
const app = document.getElementById("app");

// Render Pages

const renderHome = () => {
  console.log("rendering home");
  app.innerHTML = `
  <div id="homepage-container">
  <h1>Homepage</h1>
  <div>
  <h3>Upcoming Tournaments</h3>
  <div id="upcoming-tournaments-container">
  </div>
  <h3>My Tournaments</h3>
  <div id="my-tournaments-container">
  </div>
  <button id="create-tournament-btn">Create Tournament</button>
</div>
  `;
  if (loggedInPerson) {
    fetchTournamentsForPlayer(loggedInPerson.uid);
  }
  document
    .getElementById("create-tournament-btn")
    .addEventListener("click", () => {
      if (!loggedInPerson) {
        navigateTo("/login");
        return;
      } else {
        navigateTo("/create-tournament");
      }
    });
};

const renderLogin = () => {
  app.innerHTML = `<div id="login-container">
  <h1>Log in to Challenge</h1>
  <p>
    Welcome back! Please enter your details or log in with your social media
    account
  </p>
  <div class="form-container">
    <input type="text" placeholder="Username or email" id="email-login"/>
    <input type="password" placeholder="Password" id="password-login"/>
    <div class="checkbox-container">
      <input type="checkbox" id="remember" />
      <label for="remember">Remember on this device</label>
    </div>
    <button id="login-btn">LOG IN</button>
    <h3 id="login-status"></h3>
  </div>
</div>`;
  document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;
    document.getElementById("email-login").value = "";
    document.getElementById("password-login").value = "";
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        navigateTo("/");
        loggedInPerson = userCredential.user;
      })
      .catch((error) => {
        document.getElementById(
          "login-status"
        ).innerText = `Error: ${error.message}`;
        console.log("error", error.message);
      });
  });
};

const renderSignup = () => {
  console.log("rendering signup");
  app.innerHTML = `<div id="signup-container">
  <h1>Sign up</h1>
  <p>
    Get started easily by signing up to manage your tournaments and events
  </p>
  <input type="text" id="email" placeholder="Email" />
  <input type="password" id="password" placeholder="Password" />
  <input type="text" id="username" placeholder="Username" />
  <button id="signup-btn">SIGN UP</button>
  <h3 id="signup-status"></h3>
</div>`;
  document.getElementById("signup-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("username").value = "";
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        loggedInPerson = userCredential.user;
        db.ref("users/" + loggedInPerson.uid).set(username);
        navigateTo("/");
      })
      .catch((error) => {
        document.getElementById(
          "signup-status"
        ).textContent = `Error: ${error.message}`;
      });
  });
};

const renderCreateTournament = () => {
  app.innerHTML = `    
  <h1>Create a new Tournament</h1>
  <div id="create-tournament-container">
    <h3>BASIC INFO</h3>
    <div id="create-tournament-form">
      <span
        ><label for="tournament-name">Tournament Name</label>
        <input type="text" id="tournament-name"
      /></span>
      <span>
        <label for="game">Game</label><input type="text" id="game" />
      </span>
      <span>
        <label for="description">Description</label>
        <input type="text" id="description" />
      </span>
      <span>
        <button id="submit-tournament">Create Tournament</button>
      </span>
    </div>
  </div>`;
  document.getElementById("submit-tournament").addEventListener("click", () => {
    const tournamentName = $("#tournament-name").val();
    const game = $("#game").val();
    const description = $("#description").val();
    const playersObj = {};
    playersObj[loggedInPerson.uid] = {
      isInTournament: true,
    };
    const tournament = {
      tournamentName: tournamentName,
      game: game,
      description: description,
      owner: loggedInPerson.uid,
      players: playersObj,
    };
    const newTournamentRef = db.ref("tournaments").push();
    newTournamentRef.set(tournament).then(() => {
      console.log("tournament created");
      navigateTo("/tournament/" + newTournamentRef.key);
    });
  });
};

const displayTournamentDetails = (tournamentData) => {
  app.innerHTML = `
      <div id="tournament-details">
      <h1>${tournamentData.tournamentName}</h1>
      <p>Game: ${tournamentData.game}</p>
      <p>Description: ${tournamentData.description}</p>
      <h3>Players</h3>
      <ul id="players-list"></ul>
      <button id="back-button">Back to Home</button>
      <button id="create-bracket">Create Bracket</button>
      </div>
      </div>
      <div id="bracket-container">
      </div>
  `;

  // Populate players list if any
  const playersList = document.getElementById("players-list");
  for (const playerId in tournamentData.players) {
    const playerItem = document.createElement("li");
    playerItem.textContent = playerId;
    playersList.appendChild(playerItem);
  }
  if (loggedInPerson.uid === tournamentData.owner) {
    document.getElementById("create-bracket").style.display = "block";
    document
      .getElementById("create-bracket")
      .addEventListener("click", () => {});
  }

  document.getElementById("back-button").addEventListener("click", () => {
    navigateTo("/");
  });
};

const renderTournament = (tournamentId) => {
  const tournamentRef = db.ref("tournaments/" + tournamentId);
  tournamentRef.once("value").then((snapshot) => {
    const tournamentData = snapshot.val();
    if (!tournamentData) {
      app.innerHTML = "<h1>Tournament Not Found</h1>";
      return;
    }

    displayTournamentDetails(tournamentData);
  });
};

const routeToPage = (parts) => {
  const primaryRoute = parts[1];
  switch (primaryRoute) {
    case "create-tournament":
      renderCreateTournament();
      break;
    case undefined:
      renderHome();
      break;
    case "login":
      renderLogin();
      break;
    case "signup":
      renderSignup();
      break;
    case "tournament":
      console.log();
      renderTournament(parts[2]);
      break;
    default:
      renderHome();
  }
};

const navigateTo = (path) => {
  window.history.pushState({}, path, window.location.origin + path);
  const pn = window.location.pathname;
  const URLparts = pn.split("/");

  routeToPage(URLparts);
};

const fetchTournamentsForPlayer = (uid) => {
  const container = document.getElementById("my-tournaments-container");
  const upcomingContainer = document.getElementById(
    "upcoming-tournaments-container"
  );

  container.innerHTML = "";
  upcomingContainer.innerHTML = "";

  const tournamentsRef = db.ref("tournaments");

  tournamentsRef.once("value", (snapshot) => {
    const allTournaments = snapshot.val();

    Object.keys(allTournaments).forEach((tournamentId) => {
      const tournament = allTournaments[tournamentId];
      const div = document.createElement("h3");

      div.className = "tournament-entry";
      div.innerText = tournament.tournamentName;
      div.addEventListener("click", () => {
        navigateTo("/tournament/" + tournamentId);
      });

      if (tournament.players && uid in tournament.players) {
        container.appendChild(div);
      } else {
        upcomingContainer.appendChild(div);
      }
    });
  });
};

// Event Listeners

document.addEventListener("DOMContentLoaded", () => {
  const pn = window.location.pathname;
  const URLparts = pn.split("/");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      updateUIBasedOnAuth(user);
      loggedInPerson = user;
      document.getElementById("logout").class;
      routeToPage(URLparts);
    } else {
      loggedInPerson = false;
      routeToPage(URLparts);
    }
  });
});

const updateUIBasedOnAuth = (user) => {
  const loginBtn = document.getElementById("login");
  const signupBtn = document.getElementById("signup");
  const logoutBtn = document.getElementById("logout");
  const usernameElem = document.getElementById("username-display");

  if (user) {
    loggedInPerson = user;

    // Hide login and signup buttons
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";

    // Show logout button and user email
    if (logoutBtn) logoutBtn.style.display = "block";
    if (usernameElem) {
      db.ref("users/" + loggedInPerson.uid).once("value", (snapshot) => {
        console.log("yoyoyo", snapshot.val());
        usernameElem.textContent = snapshot.val();
      });
    }
  } else {
    loggedInPerson = null;

    if (loginBtn) loginBtn.style.display = "block";
    if (signupBtn) signupBtn.style.display = "block";

    if (logoutBtn) logoutBtn.style.display = "none";
    if (usernameElem) usernameElem.textContent = "";
  }
};

window.addEventListener("popstate", () => {
  const pn = window.location.pathname;
  const URLparts = pn.split("/");
  routeToPage(URLparts);
});

document.getElementById("home").addEventListener("click", () => {
  navigateTo("/");
});

document.getElementById("login").addEventListener("click", () => {
  navigateTo("/login");
});
document.getElementById("signup").addEventListener("click", () => {
  navigateTo("/signup");
});

document.getElementById("logout").addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      updateUIBasedOnAuth(null);
      navigateTo("/");
    })
    .catch((error) => {
      console.log("error", error);
    });
});
