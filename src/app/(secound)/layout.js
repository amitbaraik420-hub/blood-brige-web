import React from 'react'
import Navbar from '../navbar/page'
import Footer from '../components/Footer'
import DonationRequests from './donation-requests/page'

export default function layout({ children}) {
  return (
    <div>
         <Navbar />
          <DonationRequests/>
        {children}
         <Footer />
    </div>
  )
}
