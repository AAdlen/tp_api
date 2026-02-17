let classes = {};

const playerForm = document.getElementById("playerForm");
const deletePlayerForm = document.getElementById("deletePlayer");
const moveButton = document.getElementById("moveBTN");
const attackButton = document.getElementById("attackBTN");
const classAttributes = document.getElementById("classAttributes");

async function loadClasses() {
  try {
    const res = await fetch("/classes");
    classes = await res.json();
  } catch (err) {
    console.error("Error loading classes:", err);
  }
}

async function loadPlayerFromGame(gameID) {
  try {
    const res = await fetch(`/players/${gameID}`);
    const userData = await res.json();
    return userData;
  } catch (err) {
    console.error("Error loading classes:", err);
  }
}

async function loadGame(gameID) {
  try {
    const res = await fetch(`/games/${gameID}`);
    const gameData = await res.json();
    const userData = await loadPlayerFromGame(gameID);
    changeDescriptionGame(gameData, userData);
  } catch (err) {
    console.error("Error loading classes:", err);
  }
}

function changeDescriptionClasses() {

  const userclass = document.getElementById("userclass").value;
  const classData = classes[userclass];

  document.getElementById("classTitle").innerHTML = userclass;
  document.getElementById("classDescription").innerHTML = classData.description;

  const attrList = document.getElementById("classAttributes");
  attrList.innerHTML = "";

  for (const stat in classData.stats) {
    attrList.innerHTML += `<li>${stat.toUpperCase()} : ${classData.stats[stat]}</li>`;
  }

}

function changeDescriptionGame(gameData, playerData) {

  console.log(gameData);
  console.log(playerData);

  document.getElementById("classTitle").innerHTML = playerData.username + " - " + playerData.userclass;
  document.getElementById("classDescription").innerHTML = "";

  const attrList = document.getElementById("classAttributes");
  attrList.innerHTML = "";

  for (const stat in playerData) {
    attrList.innerHTML += `<li>${stat.toUpperCase()} : ${playerData[stat]}</li>`;
  }

}

async function createPlayer() {

  let username = document.getElementById("username").value;
  let userclass = document.getElementById("userclass").value;

  const classData = classes[userclass];

  let userarray = {
    username: username,
    userclass: userclass,
    hp: classData.stats.hp,
    str: classData.stats.str,
    int: classData.stats.int,
    def: classData.stats.def,
    speed: classData.stats.speed,
    luck: classData.stats.luck
  }

  try {

    const res = await fetch("http://localhost:3000/players/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userarray)
    })
    const data = await res.json();
    alert("Vous venez de créer le personnage numéro #" + data.id + " !");
    createGame(data.id);
  }
  catch (err) {
    console.error(err);
  }
}

async function deletePlayer() {

  let id = document.getElementById("playerID").value;

  try {

    const res = await fetch(`http://localhost:3000/players/${id}`, {
      method: "DELETE",
    })
    const data = await res.json();
    alert(data.message);
    console.log(data);
  }
  catch (err) {
    console.error(err);
  }
}

async function createGame(playerID) {

  try {

    const res = await fetch(`http://localhost:3000/games/${playerID}`, {
      method: "POST"
    })
    const data = await res.json();
    localStorage.setItem("currentGameID", data.id);
    loadGame(data.id);
  }
  catch (err) {
    console.error(err);
  }
}

async function move(gameID) {

  try {

    const res = await fetch(`http://localhost:3000/games/${gameID}/move`, {
      method: "POST"
    })
    const data = await res.json();
    if(data.monster){
      document.getElementById("monsterName").innerHTML = data.monster.name;
    }
  }
  catch (err) {
    console.error(err);
  }
}

async function attack(gameID) {

  try {

    const res = await fetch(`http://localhost:3000/games/${gameID}/attack`, {
      method: "POST"
    })
    const data = await res.json();
  }
  catch (err) {
    console.error(err);
  }
}

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createPlayer();
})

deletePlayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  deletePlayer();
})

moveButton.addEventListener("click", (event) => {
  event.preventDefault();
  move(2);
})

attackButton.addEventListener("click", (event) => {
  event.preventDefault();
  attack(2);
  hurtSprite();
})

function hurtSprite(){
  document.getElementById("monsterImage").src = "img/slime1hurt.png";
  setTimeout(fineSprite, 150);
}

function fineSprite(){
  document.getElementById("monsterImage").src = "img/slime1.png";
}

loadClasses();

if(localStorage.getItem("currentGameID")!=null){
  const currentGameID = localStorage.getItem("currentGameID");
  loadGame(currentGameID);
} else {
  changeDescriptionClasses();
}