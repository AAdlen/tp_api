const playerForm = document.getElementById("playerForm");

function sendData() {

  let id = document.getElementById("id").value;
  let username = document.getElementById("username").value;
  let userclass = document.getElementById("userclass").value;

  let userarray = `{"id":${id}, "username":${username}, "userclass":${userclass}}`

  /*let userarray = new Map();

  userarray.set("id", id);
  userarray.set("username", username);
  userarray.set("userclass", userclass);*/


  fetch("/players/newplayer", {
    method: "POST",
    body: userarray
  })
    .then(console.log(userarray))
    .catch(err => console.error(err));
}


playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
})