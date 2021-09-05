import React from 'react'
import "./Documentation.css"

const Documentation = () => {
    console.log("docume");

    return (
        <div className="documentation">
            <b>Documentation:</b>

            <p>These webApp has mainly three three components:</p>
            <ul>
                <li>Question</li>
                <li>Shop</li>
                <li>Stalk</li>
            </ul>

            <p>The first Component- Question- has three main sections: </p>

            <div>
                <img style={{ height: "80px", width: "80px" }} src={process.env.PUBLIC_URL + '/mainpage.PNG'} alt="" />
            </div>

            <li>Question component</li>

        </div>
    )
}

export default Documentation
