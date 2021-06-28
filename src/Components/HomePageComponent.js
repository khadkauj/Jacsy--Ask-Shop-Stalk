import React from 'react'
import ListNews from './ListNews'
import BottomAppBar from "./AskQuestion/AskMeAQuestionComponent"
import './HomePageComponent.css'

const HomePageComponent = () => {
    return (
        <div id="homepage__main">
            {/* the below is question ask topappbar */}
            <div className="bottomBar__main">
                <BottomAppBar />
            </div>
            {/* the below is grid in main homepage */}
            <div className="tets">
                <ListNews />
            </div>
        </div>
    )
}

export default HomePageComponent
