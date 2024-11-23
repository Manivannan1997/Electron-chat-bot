const { app, BrowserWindow, screen } = require('electron');
const { ipcMain } = require('electron');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

// Reload Electron in development mode
if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}

let mainWindow;

function createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    console.log("width", width)

    mainWindow = new BrowserWindow({
        width: 700,
        height: 800,
        icon: __dirname + "/assets/images/logo.png",
        maximizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setResizable(true)    
    // mainWindow.webContents.openDevTools();

    // Load the appropriate content based on the environment
    if (process.env.NODE_ENV === 'development') {
        // Ensure React development server is running on http://localhost:8080
        mainWindow.loadURL('http://localhost:8080');
    } else {
        // Load the production build of React app
        mainWindow.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}`);
    }
      
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// app.on('ready', createMainWindow);

app.whenReady().then(() => {
    createMainWindow();
  
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
    
// Listen for the 'login' event from the renderer process
ipcMain.on('login', (event, { email, password }) => {
    try {
        console.log(email, password)
      // Check the credentials (you should replace this with actual authentication logic)
      if (email === 'test@example.com' && password === 'password') {
        // Send a success response back to the renderer
        event.reply('login-response', { success: true, response: 'Login successful!' });
      } else {
        // Send an error response back to the renderer
        event.reply('login-response', { success: false, error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      event.reply('login-response', { success: false, error: 'An error occurred during login' });
    }
});

//Using Hugging face

ipcMain.on('generate-text', async (event, { inputText }) => {
    console.log('Received request to generate text.');

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
        console.error('Hugging Face API key is not set.');
        event.reply('chat-response', {
            success: false,
            error: 'Server configuration issue. Contact the admin.',
        });
        return;
    }

    if (!inputText || inputText.trim() === '') {
        event.reply('chat-response', {
            success: false,
            error: 'Input text is required.',
        });
        return;
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct/v1/chat/completions',
            {
                model: 'Qwen/Qwen2.5-1.5B-Instruct',
                messages: [
                    { role: 'user', content: inputText },
                ],
                max_tokens: 500,
                stream: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Send the generated text back to the renderer process
        console.log(response.data?.choices[0]?.message?.content.trim() || '')
        event.reply('chat-response', {
            success: true,
            text: response.data?.choices[0]?.message?.content.trim() || '',
        });
    } catch (error) {
        console.error('Error in Hugging Face API request:', error.response?.data || error.message);

        event.reply('chat-response', {
            success: false,
            error: error.response?.data?.error || 'Failed to generate text. Please try again.',
        });
    }
});

// Using OpenAI
// ipcMain.on('generate-text', async (event, { inputText }) => {
//     console.log('Received request to generate text.');

//     if (!process.env.OPENAI_API_KEY) {
//         console.error('OpenAI API key is not set.');
//         event.reply('chat-response', {
//             success: false,
//             error: 'Server configuration issue. Contact the admin.',
//         });
//         return;
//     }

//     if (!inputText || inputText.trim() === '') {
//         event.reply('chat-response', {
//             success: false,
//             error: 'Input text is required.',
//         });
//         return;
//     }

//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [
//                     { role: 'system', content: 'You are a helpful assistant.' },
//                     { role: 'user', content: inputText },
//                 ],
//                 max_tokens: 100,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (error.response?.data?.error?.type === 'insufficient_quota') {
//             event.reply('chat-response', {
//                 success: false,
//                 error: 'API quota exceeded. Please try again later.',
//             });
//             return;
//         }
//         // Send the generated text back to the renderer process
//         event.reply('chat-response', {
//             success: true,
//             text: response.data.choices[0]?.message?.content.trim() || '',
//         });
//     } catch (error) {
//         console.error('Error in OpenAI API request:', error.message || error);
//         event.reply('chat-response', {
//             success: false,
//             error: error.response?.data?.error?.message || 'Failed to generate text. Please try again.',
//         });
//     }
// });
