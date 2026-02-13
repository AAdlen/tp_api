const playerForm = document.getElementById("playerForm");
const classTitle = document.getElementById("classTitle");
const deletePlayerForm = document.getElementById("deletePlayer");
const classDescription = document.getElementById("classDescription");
const classAttributes = document.getElementById("classAttributes")

const descriptionList = new Map();
descriptionList.set("Knight","Legend says he is so strong no hit makes him budge, definitely not a hollow knight.")
descriptionList.set("Wizard","")

const attributeList = new Map();
attributeList.set("KnightHP",50).set("KnightSTR",10).set("KnightINT",0).set("KnightDEF",10).set("KnightSPEED",2).set("KnightLUCK",3);

function changeDescription(){
  let userclass = document.getElementById("userclass").value;

  classTitle.innerHTML = userclass;

  classDescription.innerHTML =  descriptionList.get(userclass);

  classAttributes.innerHTML = "<li> HP : " + attributeList.get(userclass + "HP") + "</li>"
  classAttributes.innerHTML += "<li> STR : " + attributeList.get(userclass + "STR") + "</li>"
  classAttributes.innerHTML += "<li> INT : " + attributeList.get(userclass + "INT") + "</li>"
  classAttributes.innerHTML += "<li> DEF : " + attributeList.get(userclass + "DEF") + "</li>"
  classAttributes.innerHTML += "<li> SPEED : " + attributeList.get(userclass + "SPEED") + "</li>"
  classAttributes.innerHTML += "<li> LUCK : " + attributeList.get(userclass + "LUCK") + "</li>"

}

async function sendData() {

  let username = document.getElementById("username").value;
  let userclass = document.getElementById("userclass").value;

  let userarray = {
    username: username,
    userclass: userclass
  }

try {

  const res = await fetch("http://localhost:3000/players/", {
    method: "POST",
    headers : {"Content-Type": "application/json"},
    body: JSON.stringify(userarray)
  })
     const data = await res.json();
     alert(data.message);
     console.log(data);
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


playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
})

deletePlayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  deletePlayer();
})