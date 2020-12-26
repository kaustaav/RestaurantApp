import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { StateProvider } from "./context/StateProvider";
import Content from "./Content";
import reducer, { initialState } from "./context/reducer";
import './App.css';

function App() {
    return (
      <Router>
        <StateProvider initialState={initialState} reducer={reducer}>
          <Content/>
        </StateProvider>
      </Router>
    );
}
export default App;