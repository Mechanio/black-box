import React, {useState, useEffect} from 'react'
import fetchservice from "./services/fetch.service";
import axios from "axios";
import {Link} from "react-router-dom";

const Profile = () => {
    const [profileInfo, setProfileInfo] = useState("");
    const [password, setPassword] = useState('');
    const [scores, setScores] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.patch("http://localhost:5000/api/users/" + profileInfo.id, {password})
                .then((response) => {
                    console.log(response.data.message)
                    if (response.data.message === "Updated") {
                        alert("Password changed")
                        // window.location.reload()
                    }
                },
                (error) => {
                console.log(error)
                })
        } catch (err) {
            console.log(err)
        }
    }

    const fetchData = async () => {
        const response1 =  await fetchservice.getProfileInfo()
        setProfileInfo(response1.data)
        const response2 = await fetchservice.getScoresForUser(response1.data.id)
        setScores(response2.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="user-bg">
            <div className="left-div"></div>
            <div className="user">
            {profileInfo && <>
                <h3>Name: {profileInfo.firstname + " " + profileInfo.lastname}</h3>
                <h3>Nickname: {profileInfo.nickname}</h3>
                <h3>Email: {profileInfo.email}</h3>
                <div className="form-group row">
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Change password:  </label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="btn btn-primary" type="submit">Change</button>
                </form>
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
            </>}
            </div>
            <div className="right-div"></div>
        </div>
    )
};

export default Profile