import React, { useEffect, useState } from 'react'
import AskMeAQuestionComponent from "./AskQuestion/AskMeAQuestionComponent"
import { HomePageComponentsToSync } from "./ContextComponent"
import './HomePageComponent.css'

const HomePageComponent = ({ state }) => {
    const [stateForHomePageTwoNestedCompToSync, setStateForHomePageTwoNestedCompToSync] = useState(false)

    return (
        <HomePageComponentsToSync.Provider value={{ stateForHomePageTwoNestedCompToSync, setStateForHomePageTwoNestedCompToSync }}>
            <div id="homepage__main">
                {/* the below is question ask topappbar */}
                <div className="bottomBar__main">
                    <AskMeAQuestionComponent user={state} />
                </div>
                {/* the below is grid in main homepage */}
                {/* <div className="tets" id="tets__id">
                    <ListNews />
                </div> */}
            </div>
        </HomePageComponentsToSync.Provider>

    )
}

export default HomePageComponent
