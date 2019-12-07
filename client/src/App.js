import React from 'react';
import Header from './components/Header'
import Homepage from './components/Homepage'
import {AuthProvider} from './Auth/AuthContext'
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header /> 
        <Homepage />
      </AuthProvider>
    </div>
  );
}

export default App;
