// DATA FLOW

// Request: Ajax -> Node Server -> MySQL

// Respond: mySQL -> Node Server -> Ajax

// All interactions, other than updating an exercise, should happen via Ajax.
// This means that at no time should the page refresh.
// Instead Ajax calls should be used to GET or POST to the server
// and it should use the data the server provides to update the page.
function cancel() {
  document.getElementById("form").reset();
  document.getElementById("updateRow").classList.add("hide");
  document.getElementById("submitRow").classList.remove("hide");
}

function deleteEntry(id) {
  let xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `/workout/${id}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      console.log(this.responseText);
      document.getElementById(id).remove();
    }
  }; // end onReadyState
  xhttp.send();
}
// * Needs to return date in   //date.value = "2021-02-02"
// * from mm/dd/yyyy
function formatDateForUpdate(date) {
  let tempdate = date.split("/");
  let month = Number(tempdate[0]) < 10 ? `0${tempdate[0]}` : tempdate[0];
  let day = Number(tempdate[1]) < 10 ? `0${tempdate[1]}` : tempdate[1];
  let year = tempdate[2];

  return `${year}-${month}-${day}`;
}
// *  Takes values from a row in the table and places them in the form
// * Form will make 'POST' request to update entry in database (this maybe wrong)
// * Page will have to be refreshed to see changes

function updateEntry(id) {
  // ? Filling form with values of table
  let row = document.getElementById(id);
  document.getElementById("name").value = row.cells[0].innerText;
  document.getElementById("reps").value = row.cells[1].innerText;
  document.getElementById("weight").value = row.cells[2].innerText;

  row.cells[3].innerText === "lbs"
    ? (document.getElementById("english").checked = true)
    : (document.getElementById("metric").checked = true);

  let date = row.cells[4].innerText;

  document.getElementById("date").value = formatDateForUpdate(date);

  document.getElementById("id").value = id;

  document.getElementById("updateRow").classList.remove("hide");
  document.getElementById("submitRow").classList.add("hide");
}

function update() {
  let payload = {};
  let xhttp = new XMLHttpRequest();
  payload.id = document.getElementById("id").value;
  payload.name = document.getElementById("name").value;
  if (payload.name === "") return;

  payload.reps = document.getElementById("reps").value;
  payload.weight = document.getElementById("weight").value;
  payload.date = document.getElementById("date").value;

  document.getElementsByName("units").forEach((element) => {
    if (element.checked) payload.lbs = Number(element.value);
  });

  xhttp.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let result = this.responseText;
      let tempRow = document.getElementById(payload.id);

      tempRow.insertAdjacentHTML("afterend", result);
      tempRow.remove();
      cancel();
    }
  };

  xhttp.open("PUT", `/workout/${payload.id}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(payload));

  event.preventDefault();
}

function insertWorkout() {
  let payload = {};
  let xhttp = new XMLHttpRequest();

  payload.name = document.getElementById("name").value;
  if (payload.name === "") return;

  payload.reps = document.getElementById("reps").value;
  payload.weight = document.getElementById("weight").value;
  payload.date = document.getElementById("date").value;

  document.getElementsByName("units").forEach((element) => {
    if (element.checked) payload.lbs = Number(element.value);
  });

  xhttp.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let result = this.responseText;
      document.getElementById("tblBdy").insertAdjacentHTML("beforeend", result);
      document.getElementById("form").reset();
    }
  };

  console.log(payload);

  xhttp.open("POST", "/workout", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(payload));

  event.preventDefault();
}
