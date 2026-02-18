let classes = {};

let cooldown = false;
const cooldownTime = 500;

localStorage.setItem("HURTTHESLIME", true);

const playerForm = document.getElementById("playerForm");
const deletePlayerForm = document.getElementById("deletePlayer");
const monsterForm = document.getElementById("monsterForm");
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

  changeDescriptionClasses();
}

async function loadMonsterFromGame(gameID) {
  try {
    const res = await fetch(`/games/${gameID}`);
    const gameData = await res.json();
    try {
      const res = await fetch(`/admin/monsters/${gameData.current_monster}`);
      const monsterData = await res.json();
      return monsterData;
    } catch (err) {
      console.error("Error loading :", err);
    }
  } catch (err) {
    console.error("Error loading clsses:", err);
  }
}

async function loadPlayerFromGame(gameID) {
  try {
    const res = await fetch(`/players/${gameID}`);
    const userData = await res.json();
    return userData;
  } catch (err) {
    console.error("Error loading :", err);
  }
}

async function loadGame(gameID) {
  try {
    const res = await fetch(`/games/${gameID}`);
    const gameData = await res.json();
    const userData = await loadPlayerFromGame(gameID);
    const monsterData = await loadMonsterFromGame(gameID);
    changeDescriptionGame(gameData, userData, monsterData);
  } catch (err) {
    console.error("Error loading :", err);
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

function changeDescriptionGame(gameData, playerData, monsterData) {

  if(monsterData.name==undefined){
    monsterData.name = "Empty"
  }

  if(monsterData.name != "Empty"){
    localStorage.setItem("monsterInRoom", "true");
  } else {
    localStorage.setItem("monsterInRoom", "false");
  }

  document.getElementById("classTitle").innerHTML = playerData.username + " - " + playerData.userclass;
  document.getElementById("classDescription").innerHTML = "Player ID : " + playerData.id;
  document.getElementById("classAttributes").innerHTML = "HP : " + playerData.hp + " | DMG : " + (playerData.str+playerData.int) + " | DEF : " + playerData.def;
  document.getElementById("classImage").innerHTML = "<img src='./img/classes-img/" + (playerData.userclass).toLowerCase() + ".png' width='240px' height='306px'>";

  document.getElementById("currentMonsterName").innerHTML = "Floor " + gameData.current_floor + " - " + monsterData.name;

  if (monsterData.name != "Empty") {
    document.getElementById("currentMonsterStats").innerHTML = "HP : " + gameData.monster_hp + " | ATK : " + gameData.monster_atk + " | DEF : " + gameData.monster_def;
    localStorage.setItem("currentMonsterSprite", monsterData.sprite)
    localStorage.setItem("currentMonsterSpriteHurt", monsterData.sprite_hurt)
    hurtSprite();
  } else {
    document.getElementById("currentMonsterStats").innerHTML = "";
    localStorage.setItem("currentMonsterSprite", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D")
    localStorage.setItem("currentMonsterSpriteHurt", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D")
    document.getElementById("monsterSpriteImg").src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
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

async function createMonster() {

  let monsterarray = {
    name: document.getElementById("monsterName").value,
    sprite: document.getElementById("monsterSprite").value,
    spriteHurt: document.getElementById("monsterSpriteHurt").value,
    hp: document.getElementById("monsterHP").value,
    atk: document.getElementById("monsterATK").value,
    def: document.getElementById("monsterDEF").value
  }

  try {

    const res = await fetch("http://localhost:3000/admin/monsters/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(monsterarray)
    })
    const data = await res.json();
    alert("Vous venez de créer le monstre numéro #" + data.id + " !");
  }
  catch (err) {
    console.error(err);
  }
}

async function move(gameID) {

  localStorage.setItem("HURTTHESLIME", false);

  try {

    const res = await fetch(`http://localhost:3000/games/${gameID}/move`, {
      method: "POST"
    })
    const data = await res.json();
    console.log(data.victory);
    if(data.victory=="true"){
      alert("YOU WON! CONGRATS! (You can still keep playing this run until you die btw)")
    }
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
    data = await res.json()
    if(data.monster == "killed"){
      move(gameID);
      loadGame(gameID)
    }
    if(data.player == "killed"){
      alert("You died! Better luck next time!");
      endGame(gameID);
    }
  }
  catch (err) {
    console.error(err);
  }
}

function hurtSprite() {
  if(localStorage.getItem("HURTTHESLIME")){
    document.getElementById("monsterSpriteImg").src = localStorage.getItem("currentMonsterSpriteHurt");
    setTimeout(fineSprite, 250);
  }
}

function fineSprite() {
  document.getElementById("monsterSpriteImg").src = localStorage.getItem("currentMonsterSprite");
}

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createPlayer();
})

monsterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createMonster();
})

deletePlayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  deletePlayer();
})

moveButton.addEventListener("click", (event) => {
  event.preventDefault();
  if ((localStorage.getItem("currentGameID") != null) && (!cooldown) && (localStorage.getItem("monsterInRoom") != "true")) {
    const currentGameID = localStorage.getItem("currentGameID");
    move(currentGameID);
    startCooldown();
  }
})

attackButton.addEventListener("click", (event) => {
  event.preventDefault();
  if ((localStorage.getItem("currentGameID") != null) && (!cooldown) && (localStorage.getItem("monsterInRoom") != "false")) {
    const currentGameID = localStorage.getItem("currentGameID");
    localStorage.setItem("HURTTHESLIME", true);
    hurtSprite();
    attack(currentGameID);
    startCooldown();
    loadGame(currentGameID);
  }
})

if (localStorage.getItem("currentGameID") != null) {
  const currentGameID = localStorage.getItem("currentGameID");
  loadGame(currentGameID);
}

async function endGame(gameID){
  localStorage.clear();
  window.location.reload();
}

loadClasses();