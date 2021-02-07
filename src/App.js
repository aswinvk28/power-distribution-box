import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import DrawingApp from './components/DrawingApp'
import FrontSide from './components/FrontSide'
import RearSide from './components/RearSide'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <DrawingApp />
          </Route>
          <Route path="/front-side">
            <FrontSide />
          </Route>
          <Route path="/rear-side">
            <RearSide />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
