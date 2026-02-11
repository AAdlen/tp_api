const playerForm = document.getElementById("playerForm");

async function sendData() {

  let username = document.getElementById("username").value;
  let userclass = document.getElementById("userclass").value;

  let userarray = {
    username: username,
    userclass: userclass
  }

  //let userarray = `{"id":${id}, "username":${username}, "userclass":${userclass}}`

  /*let userarray = new Map();

  userarray.set("id", id);
  userarray.set("username", username);
  userarray.set("userclass", userclass);*/


try {

  const res = await fetch("http://localhost:3000/players/newplayer", {
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


playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
})