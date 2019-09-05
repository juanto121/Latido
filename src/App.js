import React from 'react';
import './App.css';
import LatidoContent from './Containers/Latido/LatidoContent'
import LatidoHeader from './components/LatidoHeader/LatidoHeader'

function App() {
  return (
    <div className="App">
      <LatidoHeader/>
      <LatidoContent/>
    </div>
  );
}

export default App;
