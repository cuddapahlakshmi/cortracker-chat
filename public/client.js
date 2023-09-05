const socket = io();
var audio = new Audio('/message.mp3')
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message_area')
do {
    name =  prompt('Please enter your name:')
  }while(!name)
socket.emit('user joined', name);


textarea.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

window.addEventListener('beforeunload', () => {
    socket.emit('disconnect'); // Notify server before leaving
});

function sendMessage(message) {
    let msg= {
        user: name,
        message: message.trim()
    }
    appendMessage(msg, 'outgoing')
    textarea.value = ' '
    scrollToBottom()
    socket.emit('message', msg)
}
   
function appendMessage(msg, type){
    let mainDiv= document.createElement('div')
    let className=type
    mainDiv.classList.add(className, 'message')
   

    let markup = `
        <h4>${msg.user}</h4>
         <p>${msg.message}</p>
    `

mainDiv.innerHTML = markup
messageArea.appendChild(mainDiv)

}

    
socket.on('message', (msg) =>{
   appendMessage(msg, 'incoming')
    playNotificationSound()
   scrollToBottom()

})


function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}


socket.on('user joined', (userName) => {
    const joinedMessage = `${userName} joined the chat`;
    displaySystemMessage(joinedMessage);
});

function displaySystemMessage(message) {
    let systemDiv = document.createElement('div');
    systemDiv.classList.add('system-message');

    let markup = `<p>${message}</p>`;

    systemDiv.innerHTML = markup;
    messageArea.appendChild(systemDiv);

    scrollToBottom();
}


socket.on('user left', (userName) => {
    const leftMessage = `${userName} left the chat`;
   displaySystemMessage(leftMessage);
});


// Function to play the notification sound

function playNotificationSound() {
        audio.play();
}
