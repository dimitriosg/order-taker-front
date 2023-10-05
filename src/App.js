/* eslint-disable no-unused-vars */
// src/App.js
import React from 'react';
import AppRoutes from './AppRoutes';
import store from './redux/store.js';
import Modal from 'react-modal';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Set the app element for react-modal
Modal.setAppElement('#root');

function App() {
    return (
      <Provider store={store}>
        <ReduxContent />
      </Provider>
    );
}

const ReduxContent = () => {
  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
}
  
export default App;
