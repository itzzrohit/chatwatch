const socket = io();

const joinButton = document.getElementById('joinButton');
const joinSection = document.getElementById('joinSection');
const chatRoom = document.getElementById('chatRoom');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const usernameInput = document.getElementById('usernameInput');
const userStatus = document.getElementById('userStatus');

let username = '';

// Join the chat when the user enters their name
joinButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('join', username);
        joinSection.style.display = 'none';
        chatRoom.style.display = 'flex';
    } else {
        alert('Please enter a valid name.');
    }
});

// Send a message
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('sendMessage', { username, message });
        messageInput.value = '';
    }
});

// Listen for new messages
socket.on('receiveMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Listen for previous messages
socket.on('previousMessages', (messages) => {
    messages.forEach((data) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${data.username}: ${data.message}`;
        messagesDiv.appendChild(messageElement);
    });
});

// Handle user joining and leaving
socket.on('userJoined', (message) => {
    const statusElement = document.createElement('div');
    statusElement.textContent = message;
    userStatus.appendChild(statusElement);
});

socket.on('userLeft', (message) => {
    const statusElement = document.createElement('div');
    statusElement.textContent = message;
    userStatus.appendChild(statusElement);
});
