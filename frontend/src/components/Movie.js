import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import fetchservice from "../services/fetch.service";
import './movie.css'
import authService from "../services/auth.service";

const Movie = () => {
    const [movie, setMovie] = useState([])
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
            const res = await fetchservice.getMovieInfoById(id)
            setMovie(res.data)
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
           const response = await fetchservice.addScoreForMedia(profileInfo.id, reviewText, reviewScore, movie.info.id, movie.info.title)
            if (response.data.id) {
                alert("Success")
            } else {
                throw new Error(response.response.data.message)
            }
        } catch(err) {
            console.log(err.message)
        }
    }

    if (movie.length === 0) {
        return <div>Loading...</div>;
    }


    // const dir = movie.cast.cast.filter(director => director.job === "Director")
    const dir = movie.crew.filter(({job}) => job === "Director")
    const actors = movie.cast

    return (
        <div className="movie">
            <div className="left-div"></div>

            <div className="movie-synopsis">
                <div className="poster">
                    <img src={`https://image.tmdb.org/t/p/original/${movie.info.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
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
                    <h2 className="title">{movie.info.title} <a href={`https://www.imdb.com/title/${movie.info.imdb_id}`}><img src="/IMDB_Logo_2016.svg.png" width="64px" height="32px"/></a></h2>
                    <div className="info">
                        <p>{movie.info.tagline}</p>
                        <p className="duration">Duration: {movie.info.runtime} minutes</p>
                        <p className="director">Director: <Link to={`/person/${dir[0].id}`}> {dir[0].name}</Link></p>
                        <p>Genres:
                            {movie.info.genres.map((genre) => (
                                <Link to={`/movies/genres/${genre.id}`} style={{paddingLeft: '10px'}}>
                                    {genre.name}
                                </Link>
                        ))}</p>
                        {actors ? <div className="carousel-container">
                          <h4>Cast:</h4>
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
                            {movie.info.overview}
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

export default Movie