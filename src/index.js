import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './colours.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; 

const getCurrentTheme = () => 'dark'; //window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function loadTheme(theme){
    const root = document.querySelector(':root');
    root.setAttribute('color-scheme', `${theme}`);
}

window.addEventListener('DOMContentLoaded', () => {
    console.log(getCurrentTheme());
    loadTheme(getCurrentTheme());
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();