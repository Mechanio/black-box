import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import fetchservice from "../services/fetch.service";
import './movie.css'

const TVShow = () => {
    const [tvShow, settvShow] = useState([])
    const [scores, setScores] = useState([])
    const [profileInfo, setProfileInfo] = useState([])
    const [reviewText, setReviewText] = useState([])
    const [reviewScore, setReviewScore] = useState([])
    const [averageScore, setAverageScore] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
        try {
            const response1 =  await fetchservice.getProfileInfo()
            setProfileInfo(response1.data)
            const res = await fetchservice.getTVInfoById(id)
            settvShow(res.data)
            const resp = await fetchservice.getScoresForMedia(res.data.info.id)
            setScores(resp.data)
            setAverageScore(((arr) => arr.reduce((sum, obj) => sum + obj.score_itself, 0) / arr.length)(resp.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
    }, [])

    const handleClick = async (event) => {
        event.preventDefault()
        try {
           const response = await fetchservice.addScoreForMedia(profileInfo.id, reviewText, reviewScore, tvShow.info.id, tvShow.info.name)
            if (response.data.id) {
                alert("Success")
            } else {
                throw new Error(response.response.data.message)
            }
        } catch(err) {
            console.log(err.message)
        }
    }

    if (tvShow.length === 0) {
        return <div>Loading...</div>;
    }

    const dir = tvShow.info.created_by
    const actors = tvShow.cast

    return (
        <div className="tv">
            <div className="left-div"></div>
            <div className="tv-synopsis">
                <div className="poster">
                <img src={`https://image.tmdb.org/t/p/original/${tvShow.info.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                <div className="user-score">
                    <h3> User score </h3>
                    <h3 className="average-score">{averageScore ? averageScore : '-'}</h3>
                </div>
                { profileInfo ? <>
                <div className="score">
                    <form onSubmit={handleClick}>
                        <h4 className="top-left">Write review:</h4>
                        <input type="text" placeholder="Review" value={reviewText} onChange={(e) => setReviewText(e.target.value)}/>
                        <input type="text" placeholder="Score" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)}/>
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </form>
                </div> </> : <>
                    <h4>Login first</h4>
                </>}
            </div>
            <div className="details">
                <h2 className="title">{tvShow.info.name}</h2>

                <div className="info">
                    <p>{tvShow.info.tagline}</p>
                    {dir[0] ? <p className="director">Director: {dir.map((director) => <Link to={`/person/${director.id}`}>{director.name} </Link>)}</p> : null}

                    <p>Genres:{tvShow.info.genres.map((genre) => (
                        <Link to={`/tv/genres/${genre.id}`} style={{paddingLeft: '10px'}}>
                            {genre.name}
                        </Link>
                    ))}</p>
                    {actors ? <div className="carousel-container">
                      <p>Cast:</p>
                      <div className="carousel">
                        {actors.map((actor) => (
                          <div className="actor" key={actor.id}>
                            <img className="small-actor" src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                              <h3 className="actor-name"><Link to={`/person/${actor.id}`}>{actor.name}</Link></h3>
                              <h3 className="actor-role">{actor.character}</h3>
                          </div>
                        ))}
                      </div>
                    </div> : null}
                    <div className="description">
                            <h4>Description:</h4>
                            {tvShow.info.overview}
                        </div>
                        <div>
                            <h3>Reviews:</h3>
                            {scores.length !== 0 ? <div className="scores">
                              {scores.map((score) => (
                                  <div className="score">
                                      <div className="top">
                                          <p className="top-left">User: <Link to={`/user/${score.user.id}`} style={{paddingLeft: '10px'}}>
                                              {score.user.nickname}
                                          </Link></p>
                                          <p className="top-right">{score.score_itself}</p>
                                      </div>
                                      <p className="top-left">{score.review}</p>
                                  </div>
                              ))}</div> : <h4>No reviews yet. Become first</h4>}
                        </div>
                </div>
            </div>
            </div>
            <div className="right-div"></div>
        </div>
    )
}

export default TVShow