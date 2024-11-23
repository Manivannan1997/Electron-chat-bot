console.log("Preload script loaded");  // Add this to check if preload.js is running
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Send Login Request
    login: ({ email, password }) => {
        ipcRenderer.send('login', { email, password });
    },
    // Listen login response
    onLoginResponse: (callback) => {
        ipcRenderer.on('login-response', (event, data) => callback(data));
    },
    // Send request to generate text
    chat: (inputText) => {
        ipcRenderer.send('generate-text', { inputText });
    },
    // Listen chat response
    onChatResponse: (callback) => {
        ipcRenderer.on('chat-response', (event, data) => callback(data));
    },
});
