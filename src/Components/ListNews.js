import React from 'react'
import "./ListNews.css"

const ListNews = () => {
    const listOfNews = [
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        }
    ]
    return (
        <div> {listOfNews.map(news => (
            <div className="main">
                <img src={news.imageSource} alt="" className="imagehomepageList" />
                <div className="innerdiv" >
                    <h4>{ news.heading}</h4>
                    <p>{news.news.slice(0, 70)}..... </p>
                </div>
            </div>
        ))}
        </div>
    )
}

export default ListNews
