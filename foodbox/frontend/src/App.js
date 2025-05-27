import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Home from './Pages/Home';
import Howtouse from './Pages/Howtouse';
import Inventory from './Pages/Inventory';
import Contact from './Pages/Contact';
import Notification from './Pages/Notification';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Donate from './Pages/Donate';
import Footer from './Components/Footer/Footer';
import Requestdonation from './Pages/Requestdonation';
import Map from './Pages/Map';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
      <Navbar/>
      <div className="main-content">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/howtouse' element={<Howtouse/>}/>
        <Route path='/inventory' element={<Inventory/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/notification' element={<Notification/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/donate' element={<Donate/>}/>
        <Route path='/requestdonation' element={<Requestdonation/>}/>
        <Route path='/map/:donationId' element={<Map/>}/>
      </Routes>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
