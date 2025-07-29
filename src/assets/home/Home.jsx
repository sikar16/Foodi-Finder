import React from 'react'
import { Header } from './component/Header'
import Landingpage from './component/Landingpage'
import { Footer } from './component/Footer'

function Home() {
    return (
        <div className='w-full'>
            {/* <Header /> */}
            <Landingpage />
            {/* <Footer /> */}
        </div>
    )
}

export default Home