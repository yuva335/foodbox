import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css'
import iconNotification from '../Assets/icon-notification.png'
import logo from '../Assets/logo.png'

const Navbar = () => {

    const [menu,setMenu]= useState("Home");

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt=""/>
            <p>FoodBox</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration:'none'}} to ='/'>Home</Link>{menu==="home"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("howtouse")}}><Link style={{textDecoration:'none'}} to ='/howtouse'>How To Use</Link>{menu==="howtouse"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("inventory")}}><Link style={{textDecoration:'none'}} to ='/inventory'>Inventory</Link>{menu==="inventory"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("contact")}}><Link style={{textDecoration:'none'}} to ='/contact'>Contact Us</Link>{menu==="contact"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-notif">
            <Link to ='/signup'><button>Join</button></Link>
            <Link to ="/notification"><img src={iconNotification} alt="Notification"/></Link>
        </div>
    </div>
  )
}

export default Navbar;