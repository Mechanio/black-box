import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import fetchservice from "../services/fetch.service";
import './tv.css'

const TVShow = () => {
    const [tvShow, settvShow] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await fetchservice.getTVInfoById(id)
            settvShow(res.data)

        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
    }, [])

    if (tvShow.length === 0) {
        return <div>Loading...</div>;
    }


    // const dir = movie.cast.cast.filter(director => director.job === "Director")
    const dir = tvShow.info.created_by
    const actors = tvShow.cast
    console.log(dir)
    return (
        <div className="tv">
            <div className="tv-synopsis">
                <div className="poster">
                <img src={`https://image.tmdb.org/t/p/original/${tvShow.info.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
            </div>
            <div className="details">
                <h2 className="title">{tvShow.info.name}</h2>

                <div className="info">
                    <p>{tvShow.info.tagline}</p>
                    {/*<p className="duration">{tvShow.info.runtime} minutes</p>*/}
                    {/*<a href={`https://www.imdb.com/title/${tvShow.info.imdb_id}`}><img src="/IMDB_Logo_2016.svg.png" width="64px" height="32px"/></a>*/}
                    {dir[0] ? <p className="director">Director: {dir.map((director) => <Link to={`/person/${director.id}`}>{director.name} </Link>)}</p> : null}

                    <p>Genres:</p>
                    {tvShow.info.genres.map((genre) => (
                        <Link to={`/genres/${genre.id}`}>
                            {genre.name}
                        </Link>
                    ))}
                </div>
                <div className="description">
                    {tvShow.info.overview}
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
                </div>
            </div>
            </div>

        </div>
//             <form className="form-horizontal">
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Name:</label>
//                     <div className="col-sm-3">
//                         <label>
//                             {movie?.name}
//                         </label>
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Description: </label>
//                     <div className="col-sm-3">
//                         <label>
//                             {movie?.description}
//                         </label>
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Release date: </label>
//                     <div className="col-sm-3">
//                         <label>{movie?.release_date.split(" ").slice(0, -2).join(" ")}</label>
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Director: </label>
//                     <div className="col-sm-3">
//                         <Link to={`/directors/${movie?.director.id}`}>
//                             {movie?.director.firstname + ' ' + movie?.director.lastname}
//                         </Link>
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Genres: </label>
//                     <div className="col-sm-3">
//                         {movie?.genres.map(genre => (
//                             <div>
//                                 <Link to={`/genres/${genre.id}`}>
//                                 {genre.genre}
//                                 </Link>
//                             </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Actors: </label>
//                     <div className="col-sm-3">
//                         {movie?.actors.map(actor => (
//                             <div>
//                                 <Link to={`/actors/${actor.id}`}>
//                                 {actor.firstname + ' ' + actor.lastname}
//                                 </Link>
//                             </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label className="control-label col-sm-5">Sessions: </label>
//                     <div className="col-sm-3">
//                         {movie?.sessions.map(session => (
//                             <div>
//                                 <Link to={`/sessions/${session.id}`}>
//                                 {session.date}
//                                 </Link>
//                             </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//                 <Link to={`/movies/${movie?.id}/edit`}>
//                     <input className="btn btn-primary" type="submit" value="Edit"/>
//                 </Link>
//                 <Link to={'/movies'}>
//                     <input className="btn btn-danger" type={'button'} value="Back to list of movies"/>
//                 </Link>
//             </form>

    )
}

export default TVShow