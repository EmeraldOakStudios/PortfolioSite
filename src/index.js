import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WordPressHomeApp from './wordpress/WordPressHomeApp';
import reportWebVitals from './reportWebVitals';

const wpRootElement = document.getElementById('portfolio-3d-home-root');
const appRootElement = document.getElementById('root');

if (wpRootElement) {
  const wpRoot = ReactDOM.createRoot(wpRootElement);
  wpRoot.render(
    <React.StrictMode>
      <WordPressHomeApp />
    </React.StrictMode>
  );
} else if (appRootElement) {
  const appRoot = ReactDOM.createRoot(appRootElement);
  appRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
