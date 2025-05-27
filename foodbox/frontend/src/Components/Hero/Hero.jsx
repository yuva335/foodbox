import React from 'react'
import './Hero.css'
import heroImage from '../Assets/hero-img.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>"No food should go to waste. No person should go hungry."</h2>
            <Link style={{textDecoration:'none'}} to ='/donate'><button className="donate-button">Donate Now</button></Link>
        </div>
            
        <div className="hero-right">
            <img src={heroImage} alt=""/>
        </div>
    </div>
  )
}

export default Hero