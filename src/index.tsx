import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
