let classes = {};

let cooldown = false;
const cooldownTime = 500;

const playerForm = document.getElementById("playerForm");
const deletePlayerForm = document.getElementById("deletePlayer");
const moveButton = document.getElementById("moveBTN");
const attackButton = document.getElementById("attackBTN");
const classAttributes = document.getElementById("classAttributes");
const cooldownBar = document.getElementById("cooldownBar");

async function startCooldown() {

  cooldown = true;

  let startTime = Date.now();

  function update() {
    let elapsed = Date.now() - startTime;
    let percent = Math.min((elapsed / cooldownTime) * 100, 100);

    cooldownBar.style.width = percent + "%";

    if (percent < 100) {
      requestAnimationFrame(update);
    } else {
      cooldown = false;
      cooldownBar.style.width = "0%";
    }
  }

  requestAnimationFrame(update);

}

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
  document.getElementById("classImage").innerHTML = "<img src='./img/classes-img/" + (userclass).toLowerCase() + ".png' width='240px' height='306px'>";

  const attrList = document.getElementById("classAttributes");
  attrList.innerHTML = "";

  for (const stat in classData.stats) {
    attrList.innerHTML += `<li>${stat.toUpperCase()} : ${classData.stats[stat]}</li>`;
  }

}

function changeDescriptionGame(gameData, playerData) {

  document.getElementById("classTitle").innerHTML = playerData.username + " - " + playerData.userclass;
  document.getElementById("classDescription").innerHTML = "Player ID : " + playerData.id;
  document.getElementById("classImage").innerHTML = "<img src='./img/classes-img/" + (playerData.userclass).toLowerCase() + ".png' width='240px' height='306px'>";

  const attrList = document.getElementById("classAttributes");
  attrList.innerHTML = "";

  /* for (const stat in playerData) {
    attrList.innerHTML += `<li>${stat.toUpperCase()} : ${playerData[stat]}</li>`;
  } */

  document.getElementById("currentMonsterName").innerHTML = "Floor " + gameData.current_floor + " - " + gameData.current_monster;
  if (gameData.current_monster!="Empty") {
    document.getElementById("currentMonsterStats").innerHTML = "HP : " + gameData.monster_hp + " | ATK : " + gameData.monster_atk + " | DEF : " + gameData.monster_def;
  } else {
    document.getElementById("currentMonsterStats").innerHTML = "";
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
    /*alert(data.message);
    console.log(data);*/
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
    loadGame(gameID);
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
  }
  catch (err) {
    console.error(err);
  }
}

function hurtSprite() {
  document.getElementById("monsterImage").src = "img/slime1hurt.png";
  setTimeout(fineSprite, 150);
}

function fineSprite() {
  document.getElementById("monsterImage").src = "img/slime1.png";
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
  if ((localStorage.getItem("currentGameID") != null) && (!cooldown)) {
    const currentGameID = localStorage.getItem("currentGameID");
    move(currentGameID);
    startCooldown();
  }
})

attackButton.addEventListener("click", (event) => {
  event.preventDefault();
  if ((localStorage.getItem("currentGameID") != null) && (!cooldown)) {
    const currentGameID = localStorage.getItem("currentGameID");
    hurtSprite();
    attack(currentGameID);
    startCooldown();
    loadGame(currentGameID);
  }
})

loadClasses();

if (localStorage.getItem("currentGameID") != null) {
  const currentGameID = localStorage.getItem("currentGameID");
  loadGame(currentGameID);
} else {
  changeDescriptionClasses();
}