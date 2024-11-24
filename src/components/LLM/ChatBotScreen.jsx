import React, { useState, useEffect } from 'react';
import Loader from '../shared/Loader';
import '../../styles/style.css'

const ChatBotScreen = () => {
    const [inputText, setInputText] = useState('');
    const [conversation, setConversation] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (window.electron && typeof window.electron.onChatResponse === 'function') {
            // Listen for the response from the main process
            window.electron.onChatResponse(({ success, text, error }) => {
                if (inputText.trim() === '') return;

                // Find the last question and update it with the response
                setConversation((prevConversation) => {
                    const newConversation = [...prevConversation];
                    const lastItem = newConversation.pop(); // Get the last question

                    // If there was a question, add the response to it
                    if (lastItem) {
                        newConversation.push({
                            question: lastItem.question,
                            answer: text, // Update with the response
                        });
                    }
                    return newConversation;
                });

                // Handle error
                if (!success) {
                    setError(error || 'An error occurred.');
                } else {
                    setError('');
                }
            });
        } else {
            console.error('Electron API is not available');
        }

        // Cleanup the event listener when the component unmounts
        // return () => {
        //     window.electron.offChatResponse(); // Ensure to remove the listener on unmount
        // };
    }, [inputText]); // Dependency on inputText ensures the effect runs when inputText changes

    const handleSubmit = () => {
        if (inputText.trim() !== '') {
            // Add the user's question to the conversation first
            setConversation((prevConversation) => [
                ...prevConversation,
                { question: inputText, answer: '' }, // Empty answer initially
            ]);

            // Send the question to the main process
            window.electron.chat(inputText);

            // Clear input text after sending
            setInputText('');
        }
    };

    return (
        <div className="main-container flex flex-col items-center p-8 bg-gray-200 h-screen">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl flex flex-col h-full">
                <h2 className="text-3xl font-serif font-semibold text-center text-gray-800 mb-6">Chatbot Assistant</h2>
                <hr/>
                {/* Chat history container */}
                <div className="flex-grow overflow-y-auto mt-2 mb-6 max-h-[calc(100vh-200px)]">
                    <div className="space-y-4">
                        {/* Loop through the conversation */}
                        {conversation.map((item, index) => (
                            <div key={index}>
                                {/* User's message */}
                                <div className="flex justify-end">
                                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs w-full">
                                        <p>{item.question}</p>
                                    </div>
                                </div>

                                {/* Bot's response */}
                                { item.answer ? (
                                    <div className="mt-2 flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs w-full">                                       
                                            <p>{item.answer}</p>                                        
                                        </div>
                                    </div>
                                ): (
                                    <Loader/>
                                )}                                
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error message */}
                {error && <p className="mt-2 text-red-500 text-center">{error}</p>}

                {/* Text input area pinned to the bottom */}
                <div className="w-full mt-auto">
                    <textarea
                        value={inputText} // Bind the textarea value to inputText
                        onChange={(e) => setInputText(e.target.value)} // Update inputText on change
                        placeholder="Type your message..."
                        rows={4}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
                                e.preventDefault(); // Prevent adding a new line
                                handleSubmit(); // Trigger submit
                            }
                        }}
                
                        className="input-box w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                    <button
                        type='submit'
                        onClick={handleSubmit} // Handle message submission
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBotScreen;
