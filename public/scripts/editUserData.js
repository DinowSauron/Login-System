


async function handleSendNewName() {
  if(!user) {
    location.reload();
    return;
  }

  const nameInput = document.getElementById("name")
  const newName = nameInput.value;
  if(!isNameValid(newName)) {
    return
  }
  
  if(newName === user.username) {
    alert("O novo nome deve ser diferente do anterior!")
    return;
  }

  const nameUpdatedStatus = await fetch("/changeName", {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'newName': newName
    },
  }).then((res) => res.json());

  if(nameUpdatedStatus.error) {
    window.alert(nameUpdatedStatus.error);
  } else {
    location.reload()
  }

}



function isNameValid(name) {
  const nameFormated = name.trim()
  if(nameFormated.length > 3 && nameFormated.length < 20){
    return true
  }
  return false
}