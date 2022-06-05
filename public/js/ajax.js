// DATA FLOW 

// Request: Ajax -> Node Server -> MySQL

// Respond: mySQL -> Node Server -> Ajax

// All interactions, other than updating an exercise, should happen via Ajax. 
// This means that at no time should the page refresh. 
// Instead Ajax calls should be used to GET or POST to the server 
// and it should use the data the server provides to update the page.

function deleteEntry(id) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('DELETE', `/workout/${id}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            console.log(this.responseText);
            document.getElementById(id).remove();
        }
    } // end onReadyState
    xhttp.send();
}

function loadEntries() {
    // let response = {};
    let xhttp = new XMLHttpRequest();
    // true want it to be asynchronous
    xhttp.open('GET', '/', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    // what is this used for ????
    xhttp.addEventListener('load', () => {
        if ((this.status >= 200 && this.status < 400) && (this.readyState === 4)){
        xhttp.send(JSON.parse(xhttp.responseText));
        // console.log(results);
        // alert('loaded entries ready state change')
        }
    });
    // xhttp.send(response);
    // event.preventDefault();
    // alert('loadEntries fxn!!!');
     // * create row
     let tr = document.createElement('tr');

}
  
// *  Takes values from a row in the table and places them in the form
// * Form will make 'POST' request to update entry in database (this maybe wrong)
// * Page will have to be refreshed to see changes

function updateEntry(id) {

  // ? Filling form with values of table
  let row = document.getElementById(id);
  document.getElementById('name').value = row.cells[0].innerText;
  document.getElementById('reps').value = row.cells[1].innerText;
  document.getElementById('weight').value = row.cells[2].innerText;
  document.getElementById('date').value = yyyymmddDate(row.cells[3].innerText);

  // ? change attributes of form
  let form = document.getElementById('the_form');
  form.method = 'POST';
  form.action = `/${id}?_method=PUT`;

  let formBtn = document.getElementById('add');
  formBtn.textContent = 'UPDATE';
  //loadEntries();

//   document.getElementById("myForm").reset();
}

function insertWorkout() {
  let payload = {};
  let xhttp = new XMLHttpRequest();

  payload.name = document.getElementById('name').value;
  if(payload.name === "")
    return;
  payload.reps = document.getElementById('reps').value;
  payload.weight = document.getElementById('weight').value;
  payload.date = document.getElementById('date').value;
  // fix this later always returns 1
//   payload.lbs = document.getElementById('english').value;
  payload.lbs = 1;

  xhttp.onreadystatechange = function() {
      if(this.status == 200 && this.readyState == 4) {
          let result = this.responseText;
          console.log(result);
          document.getElementById("tblBdy").insertAdjacentHTML("beforeend",result);
          document.getElementById("form").reset();

      }
  }

  console.log(payload);

  xhttp.open('POST', '/workout', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(payload));

  event.preventDefault();
}



