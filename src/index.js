import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './colours.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; 

const getCurrentTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function loadTheme(theme){
    const root = document.querySelector(':root');
    root.setAttribute('color-scheme', `${theme}`);
}

window.addEventListener('DOMContentLoaded', () => {
    let colorTheme = localStorage.getItem('colorTheme');
    if (colorTheme == null) {
        colorTheme = getCurrentTheme();
        localStorage.setItem('colorTheme', colorTheme);
    }

    loadTheme(colorTheme);
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => console.log("Registration successful, scope is:", registration.scope))
    .catch((err) => console.log("Service worker registration failed, error:", err));
} else {
    console.error("Did not fine serviceWorker in navigator");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { loadTheme };