import React from 'react';
// import logo from './logo.svg';
import './App.scss';
// import Youtube from './component/youtube'

import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers'
import { HotkeysProvider } from 'react-hotkeys-hook'

function App() {
  return (
    <HotkeysProvider initiallyActiveScopes={['settings']}>
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
  </HotkeysProvider>
  
  );
}

export default App;
