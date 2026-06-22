import React from 'react'
import Navbar from '../navbar/page'
import Footer from '../components/Footer'
import SearchDonor from './search-donor/page'

export default function layout({ children}) {
  return (
    <div>
            <Navbar />
            <SearchDonor />
        {children}
            <Footer />
    </div>
  )
}
