
setAllUsersInHTML()


async function setAllUsersInHTML() {

  const allUsers = await getAllUsers();
  if(!allUsers.allUsers) {
    return
  }

  const unorderedList = document.getElementById("list");
  const listItem = document.getElementById("iterable-list");

  allUsers.allUsers.forEach(user => {
    const newItem = listItem.cloneNode(true)
    newItem.setAttribute("id", "");
    if(user.picture){
      newItem.getElementsByTagName("img")[0]
      .setAttribute("src", user.picture)
      newItem.getElementsByTagName("img")[0]
      .setAttribute("alt", `Foto do usuário: ${user.name}`);
    }
    
    newItem.getElementsByTagName("p")[0].innerHTML = user.name;
    newItem.getElementsByTagName("p")[1].innerHTML = user.email;
    unorderedList.appendChild(newItem);
  });

  listItem.remove(); // remove o item de formatação

  

  async function getAllUsers() {
    return await fetch("/getAllUsers",{
      method: "GET",
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    }).then((res) => res.json()).then(res => res)
  }
}

  