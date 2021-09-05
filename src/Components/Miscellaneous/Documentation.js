import React from 'react'
import "./Documentation.css"

const Documentation = () => {
    console.log("docume");

    return (
        <div className="documentation">
            <b>Documentation:</b>

            <p>These webApp has mainly three five components:</p>
            <ul>
                <li>Questions</li>
                <li>Asnwers</li>
                <li>Shop</li>
                <li>Shop-Product View</li>
                <li>Stalk</li>
            </ul>
            {/*  */}
            <br />
            <p>The first Component- Question - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/mainpage.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p>You can click on any questions which will redirect yout ot the second Component- Answer - which has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/answerComp.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p>The third Component- Shop - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/shopPage.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p>The fourth Component- Shop- Product: View - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/productImage.jpg'} alt="" />
            </div>


            {/*  */}
            <br />
            <p>Furthermore, You can click on either LogIn or Settings Icon to see other options: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/settings.jpg'} alt="" />
            </div>

            <br />
            <b>If you have any confusions or feedback or want to collab, please lmk.</b>

        </div>
    )
}

export default Documentation
