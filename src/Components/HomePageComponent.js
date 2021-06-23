import React from 'react'
import HomaPageListComponent from './ListNews'
import './HomePageComponent.css'

const HomePageComponent = () => {
    return (
        <div>
            <div className="mainfromHomePage">
                <img src="https://i.kym-cdn.com/photos/images/newsfeed/000/000/130/disaster-girl.jpg" alt="homepagepic" className="imagehomepage" />
                <div>
                    <h1>A big board to write</h1>
                </div>
            </div>
            <HomaPageListComponent />
        </div>
    )
}

export default HomePageComponent
