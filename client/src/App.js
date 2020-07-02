import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './styles.scss';
import { World } from './views';

function App() {
  return (
    <BrowserRouter basename="">
      <div className="App">
        <World />
      </div>
    </BrowserRouter>
  );
}

export default App;
