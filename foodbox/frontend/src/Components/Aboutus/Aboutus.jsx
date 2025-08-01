import React from 'react'
import './Aboutus.css'
import aboutImage from '../Assets/abt-img.jpg'
const Aboutus = () => {
  return (
    <div className="about-us">
  <div className="about-image">
    <img src={aboutImage} alt="" />
  </div>
  <div className="about-text">
    <h2>About Us</h2>
    <p>
      "We are committed to helping communities by reducing food waste and sharing resources where they are needed most. Our mission is to build stronger, healthier communities by reducing food waste and ensuring surplus food reaches those who need it most. We aim to provide an easy, accessible platform for food donations, making a positive impact on both local and global scales. Be part of the change! Whether you're an individual, organization, or business, you can make a difference. By joining us, you can help reduce food waste, support your local community, and make the world a better place for everyone."
    </p>
  </div>
</div>

  )
}

export default Aboutus