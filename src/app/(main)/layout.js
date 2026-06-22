import React from 'react'
import Navbar from '../navbar/page'
import HeroBanner from '../components/HeroBanner'
import GettingStarted from '../GettingStarted/page'
import Footer from '../components/Footer'

export default function layout({ children}) {
  return (
    <div>
         <Navbar />
         <HeroBanner />
        
         <GettingStarted/>


           {children}
          
          
          <Footer />
    </div>
  )
}
