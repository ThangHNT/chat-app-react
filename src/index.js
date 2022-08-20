import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GloblaStyles';
import { UserProvider } from './components/Context/UserContext';
import { ChatContentProvider } from '~/components/Context/ChatContentContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <UserProvider>
        <ChatContentProvider>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </ChatContentProvider>
    </UserProvider>,
    // </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
