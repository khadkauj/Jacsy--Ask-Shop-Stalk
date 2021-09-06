import React from 'react'
import "./Documentation.css"

const Documentation = () => {
    console.log("docume");

    return (
        <div className="documentation">
            <b>Documentation:</b>

            <p>These webApp has mainly three Five components:</p>
            <ul>
                <li>Questions</li>
                <li>Asnwers</li>
                <li>Shop</li>
                <li>Shop-Product View</li>
                <li>LogIn</li>
            </ul>
            {/*  */}
            <br />
            <p> <b>1.</b>  The first Component- Question - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/mainpage.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p><b>2.</b> You can click on any questions which will redirect yout ot the second Component- Answer - which has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/answerComp.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p><b>3.</b> The third Component- Shop - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/shopPage.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p><b>4.</b> The fourth Component- Shop- Product: View - has given sections: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/productImage.jpg'} alt="" />
            </div>


            {/*  */}
            <br />
            <p><b>5.</b> Furthermore, You can click on either LogIn or Settings Icon to see other options: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/settings.jpg'} alt="" />
            </div>
            {/*  */}
            <br />
            <p><b>6.</b> Finally, You can log in using any of the three listed methods: </p>
            <ul><li>You can sign in using password less method ie. provide your college email address and
                get a link in  your outlook. Then, sign in using the sent link.</li>
                <li>Easy Sign in using Google or Microsoft Auth. Both of these google and outlook
                    authentication might be discontunied in future because of security reasons. </li></ul>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/login.png'} alt="" />
            </div>


            {/*  */}
            <br />
            <p><b>7.</b> Finally you can open it in chrome and go to chrom settings and install it: </p>

            <div className="documentation-image">
                <img src={process.env.PUBLIC_URL + '/install.jpg'} alt="" />
            </div>

            <br />
            <b>If you have any confusions or feedback or want to collab, please lmk.</b>

        </div>
    )
}

export default Documentation
