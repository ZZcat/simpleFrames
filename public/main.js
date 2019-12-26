/*
let socket = io();

var ccode;

socket.on('echo', (data) => {
  console.log('received echo', data)
  const div = document.createElement('div');
  div.innerHTML = data.message;
  console.log(data);
  document.body.appendChild(div)
})

socket.on('challenge', (data) => {
  console.log('received ch code', data);
  ccode = data;
})

socket.on('CRresult', (data) => {
  console.log('result', data);
})

document.querySelector('button').onclick = () => {
  socket.emit('response', 
    document.querySelector('input').value // Respond with entered text
  );
}
*/
