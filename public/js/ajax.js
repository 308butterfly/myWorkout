// DATA FLOW 

// Request: Ajax -> Node Server -> MySQL

// Respond: mySQL -> Node Server -> Ajax

// All interactions, other than updating an exercise, should happen via Ajax. 
// This means that at no time should the page refresh. 
// Instead Ajax calls should be used to GET or POST to the server 
// and it should use the data the server provides to update the page.


function test() {
  alert('bingo bango!!');
}

function loadEntries() {
  // let response = {};
  let xhttp = new XMLHttpRequest();
  // true want it to be asynchronous
  xhttp.open('GET', '/', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  // what is this used for ????
  xhttp.addEventListener('load', () => {
    if (xhttp.status >= 200 && xhttp.status < 400) {
      xhttp.send(JSON.parse(xhttp.responseText));
      // console.log(results);
      // alert('loaded entries ready state change')
    }
  });
  // xhttp.send(response);
  event.preventDefault();
  // alert('loadEntries fxn!!!');
}

// function updateEntry() {
//   alert('TOTALLY UPDATED!!!');
// }

function insertEntry() {
  // alert('insert here!!!!');
  let result = {};
  let payload = {};
  let xhttp = new XMLHttpRequest();

  xhttp.addEventListener('load', () => {
    if (xhttp.status >= 200 && xhttp.status < 400) {
      // xhttp.send(JSON.parse(xhttp.responseText));
      // console.log(results);

      loadEntries();

      alert('entry added');
    }
  });

  payload.name = document.getElementById('name').value;
  payload.reps = document.getElementById('reps').value;
  payload.weight = document.getElementById('weight').value;
  payload.date = document.getElementById('date').value;
  // fix this later always returns 1
  payload.lbs = document.getElementById('english').value;

  console.log(payload);

  xhttp.open('POST', '/add', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(payload));
  event.preventDefault();
}

// function deleteEntry(id) {
//   alert('delete...... DELETE!!!!!  ' + id);
//   let payload = {'id': id };
//   let xhttp = new XMLHttpRequest();
//   xhttp.open('POST',`/delete/${id}`, true);
//   xhttp.setRequestHeader('Content-Type','application/json');
//   xhttp.addEventListener('load', () => {
//     if(xhttp.status >= 200 && xhttp.status < 400) {
//       console.log('START OF RESPONSE TEXT');
//       console.log(xhttp.responseText);
//       console.log("END OF RESPONSE TEXT");

//     } else {
//       console.log(`Network request error: ${xhttp.statusText}`);
//     }
//   });
//   xhttp.send(JSON.stringify(payload));
//   // xhttp.send();
//   event.preventDefault();
// }

// function todaysDate() {
//   document.getElementById('date').valueAsDate = new Date();
// }