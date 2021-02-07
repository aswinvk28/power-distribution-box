import './App.css';
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import DrawingApp from './components/DrawingApp'
import { FrontSide as DrawingAppFront } from './components/FrontSide'
import { RearSide as DrawingAppRear } from './components/RearSide'

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

function FrontSide() {
  ReactDOM.render(
    <DrawingAppFront />,
    document.getElementById('distribution_front_side')
  )
}

function RearSide() {
  ReactDOM.render(
    <DrawingAppRear />,
    document.getElementById('distribution_rear_side')
  )
}

export default App;
