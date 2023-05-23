import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import fetchservice from "../services/fetch.service";
import './person.css'

const Person = () => {
    const [person, setPerson] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await fetchservice.getPersonInfoById(id)
            setPerson(res.data)

        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
    }, [])

    if (person.length === 0) {
        return <div>Loading...</div>;
    }

    const dirMovies = person.crew.filter(({job}) => job === "Director")
    const actMovies = person.cast
    console.log(dirMovies)
    return (
        <div className="person">
            <div className="person-synopsis">
                <div className="person-image">
                    <img src={`https://image.tmdb.org/t/p/original/${person.info.profile_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                </div>
                <div className="person-body">
                    <h2 className="title">{person.info.name}</h2>
                    <a href={`https://www.imdb.com/name/${person.info.imdb_id}`}><img src="/IMDB_Logo_2016.svg.png" width="64px" height="32px"/></a>
                    <p>Birthdate: {person.info.birthday}</p>
                    {person.info.deathday ? <p>Died: {person.info.deathday}</p> : null}




                    {dirMovies ? <div className="carousel-container">
                      <p>As Director:</p>
                      <div className="carousel">
                        {dirMovies.map((movie) => (
                          <div className="movie" key={movie.id}>
                            <img className="small-movie" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                              <h3 className="movie-title">{movie.title ? <Link to={`/movie/${movie.id}`}>{movie.title}</Link> : <Link to={`/tv/${movie.id}`}>{movie.name}</Link>}</h3>
                          </div>
                        ))}
                      </div>
                    </div> : null}

                    {actMovies ? <div className="carousel-container">
                      <p>As Actor:</p>
                      <div className="carousel">
                        {actMovies.map((movie) => (
                          <div className="movie" key={movie.id}>
                            <img className="small-movie" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                              <h3 className="movie-title">{movie.title ? <Link to={`/movie/${movie.id}`}>{movie.title}</Link> : <Link to={`/tv/${movie.id}`}>{movie.name}</Link>}</h3>
                          </div>
                        ))}
                      </div>
                    </div> : null}
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

export default Person;