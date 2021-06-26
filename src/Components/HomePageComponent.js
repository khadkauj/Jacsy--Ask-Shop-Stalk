import React from 'react'
import ListNews from './ListNews'
import BottomAppBar from "./AskQuestion/AskMeAQuestionComponent"
import './HomePageComponent.css'

const HomePageComponent = () => {
    return (
        <div>
            <div className="bottomBar__main">
                {/* <BottomAppBar /> */}
            </div>
            <div className="tets">
                <ListNews />
            </div>
        </div>
    )
}

export default HomePageComponent
