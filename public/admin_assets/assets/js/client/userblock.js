const block = document.getElementById("btnblock");
const active = document.getElementById("btnactive");
const unblock = document.getElementById("btn_unblock");
async function blockuser(userid) {
  try {
    console.log("entered blockuser");
    url = `http://localhost:3000/admin/users/block?id=${userid}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      window.location.reload();
    } else {
      console.error(`Error:${response.status}`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function unblockuser(userid) {
  try {
    url = `http://localhost:3000/admin/users/unblock?id=${userid}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      window.location.reload()
     
    }
    else{
      console.error(`Error:${response.status}`)
    }
  } catch (err) {
    console.error(err);
  }
}
