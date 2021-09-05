import React from 'react'
import "./TermsAndCondition.css"

const TermsAndCondition = () => {
    console.log("term");
    return (
        <div className="main-terms">
            <p className="terms-head" > <b>Terms And Condition</b></p><br />
            <p>All the datas which includes questions, answers, store products, votes on all questions,
                answers and products, product pictures, email, username and any other details are stored in
                the Firebase database which are secured by Firebase security rules. We declare that we won’t
                collect or use any of the stored data. Furthermmore, to improve the content, all Create request has to
                be authenticated. Update,and delete request has to be both authenticated and of same user to secure account.
                All Get request are public.
            </p><br />
            <p> If you wish to delete your data, you can email us privately and datas specific to you will be deleted.</p><br />
            <p> We take no responsibility for any
                harm or abuse that might occur here, please use it wisely. Any transactions you might do
                because of products in store is your responsibility, we wouldn’t be responsible for anything.
                We’re just a mediator.</p> <br />
            <p> Anyone who uses hate speech or tries to use this platform to abuse
                someone would be blocked. The  purpose is to create a forum for students of Jacobs University.
            </p>
        </div>
    )
}

export default TermsAndCondition
