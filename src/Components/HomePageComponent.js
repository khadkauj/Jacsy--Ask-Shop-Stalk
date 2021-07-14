import React, { useEffect, useState } from 'react'
import ListNews from './ListNews'
import AskMeAQuestionComponent from "./AskQuestion/AskMeAQuestionComponent"
import './HomePageComponent.css'
import { HomePageComponentsToSync } from "./ContextComponent"

const HomePageComponent = () => {
    const [stateForHomePageTwoNestedCompToSync, setStateForHomePageTwoNestedCompToSync] = useState(false)
    useEffect(() => {

        return () => {

        }
    }, [stateForHomePageTwoNestedCompToSync])
    return (
        <HomePageComponentsToSync.Provider value={{ stateForHomePageTwoNestedCompToSync, setStateForHomePageTwoNestedCompToSync }}>
            <div id="homepage__main">
                {/* the below is question ask topappbar */}
                <div className="bottomBar__main">
                    <AskMeAQuestionComponent />
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
