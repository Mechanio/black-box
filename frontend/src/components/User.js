import React, {useState, useEffect} from 'react'
import fetchservice from "../services/fetch.service";
import {Link, useParams} from "react-router-dom";

const User = () => {
    const [profileInfo, setProfileInfo] = useState([]);
    const [scores, setScores] = useState([]);
    const {id} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const response1 =  await fetchservice.getUserProfileInfo(id)
            setProfileInfo(response1.data)
            const response2 = await fetchservice.getScoresForUser(id)
            setScores(response2.data)
        }
        fetchData()
    }, [])

    if (profileInfo.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-bg">
            <div className="left-div"></div>
            <div className="user">
                <h3>Name: {profileInfo.firstname + " " + profileInfo.lastname}</h3>
                <h3>Nickname: {profileInfo.nickname}</h3>
                <div className="scores">
                    <h3>Reviews:</h3>
                        {scores.length !== 0 ? <div className="scores">
                          {scores.map((score) => (
                              <div className="score">
                                  <div className="top">
                                      <p className="top-left">Movie: <Link to={`/movie/${score.movie_id}`} style={{paddingLeft: '10px'}}>
                                          {score.movie_name}
                                      </Link></p>
                                      <p className="top-right">{score.score_itself}</p>
                                  </div>
                                  <p className="top-left">{score.review}</p>
                              </div>
                          ))}</div> : <h4>No reviews.</h4>}
                </div>
            </div>
            <div className="right-div"></div>
        </div>
    )
};

export default User