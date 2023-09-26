function getall() {
  const url = "http://localhost:4001/getuser";
  const table = document.getElementById("user1");
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((users) => {
      // Changed variable name to 'users' since it's an array
      console.log(users);
      users.forEach((user) => {
        // Iterate over users
        let newuser = table.insertRow();
        let cell1 = newuser.insertCell(0);
        let cell2 = newuser.insertCell(1);
        let cell3 = newuser.insertCell(2);
        cell1.innerHTML = user.email;
        cell2.innerHTML = user.name;
        cell3.innerHTML = `<span class='edit' onclick='Upadte(${user.id})'>Edit</span><span class='delete' onclick='deluser(${user.id})'>Delete</span>`;
        cell3.dataset.userid = user.id;
      });
    });
}

function create() {
  let form = document.querySelector(".user-form");
  let data;

  form.onsubmit = (e) => {
    e.preventDefault();
    let email1 = document.getElementById("email").value;
    let password1 = document.getElementById("password").value;
    data = {
      email: email1,
      password: password1,
    };

    const url = "http://localhost:4001/setindatabase";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        alert("User created successfully.");
        location.reload();
      } else {
        alert("Error creating user.");
      }
    });
  };
}

function deluser(userid) {
  const url = "http://localhost:4001/deleteuser"; // Adjust this URL to your backend
  fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ id: userid }),
  }).then((res) => {
    if (res.status === 200) {
      alert("User deleted successfully.");
      location.reload();
    } else {
      alert("Error deleting user.");
    }
  });
}

function Upadte(userid) {
  const url = `http://localhost:4001/getuser/${userid}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((user) => {
      if (user.length > 0) {
        document.getElementById("email").value = user[0].email;
        document.getElementById("password").value = user[0].name;
        document.querySelector(".create-user").value = "Update";
        updateuser(userid);
      } else {
        alert("User not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data: " + error);
    });
}
function updateuser(userid) {
  let form = document.querySelector(".user-form");
  let data;

  form.onsubmit = (e) => {
    e.preventDefault();
    let email1 = document.getElementById("email").value;
    let password1 = document.getElementById("password").value;
    data = {
      email: email1,
      name: password1,
      id: userid,
    };
    console.log(data);
    const url = "http://localhost:4001/update/" + userid;
    fetch(url, {
      //here i have error in fetch
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        alert("User Updated successfully.");
        location.reload();
      } else {
        alert("Error Updated user.");
      }
    });
  };
}
getall();
create();
