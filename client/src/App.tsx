import React from 'react';
// import logo from './logo.svg';
import './App.scss';
// import Youtube from './component/youtube'

import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
