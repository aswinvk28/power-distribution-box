import logo from './logo.svg';
import './App.css';
import React from 'react'
import ReactDOM from 'react-dom'
import PowerDist from './components/PowerDist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <PowerDist />
      </DndProvider>
    </div>
  );
}

export default App;
