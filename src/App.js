/* eslint-disable no-unused-vars */
// src/App.js
import React from 'react';
import AppRoutes from './AppRoutes';
import store from './redux/store.js';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


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
