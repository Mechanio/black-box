import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import fetchservice from "../services/fetch.service";
import './movie.css'

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
            <div className="left-div"></div>
            <div className="person-synopsis">
                <div className="poster">
                    <img src={`https://image.tmdb.org/t/p/original/${person.info.profile_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                </div>
                <div className="details">
                    <h2 className="title">{person.info.name}<a href={`https://www.imdb.com/name/${person.info.imdb_id}`} style={{ marginLeft: '10px'}}><img src="/IMDB_Logo_2016.svg.png" width="64px" height="32px"/></a></h2>
                    <p>Birthdate: {person.info.birthday}</p>
                    {person.info.deathday ? <p>Died: {person.info.deathday}</p> : null}
                    {dirMovies.length !== 0 ? <div className="carousel-container">
                      <p>As Director:</p>
                      <div className="carousel">
                        {dirMovies.map((movie) => (
                          <div className="actor" key={movie.id}>
                            <img className="small-actor" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                              <h3 className="actor-name">{movie.title ? <Link to={`/movie/${movie.id}`}>{movie.title}</Link> : <Link to={`/tv/${movie.id}`}>{movie.name}</Link>}</h3>
                          </div>
                        ))}
                      </div>
                    </div> : null}

                    {actMovies.length !== 0  ? <div className="carousel-container">
                      <p>As Actor:</p>
                      <div className="carousel">
                        {actMovies.map((movie) => (
                          <div className="actor" key={movie.id}>
                            <img className="small-actor" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                              <h3 className="actor-name">{movie.title ? <Link to={`/movie/${movie.id}`}>{movie.title}</Link> : <Link to={`/tv/${movie.id}`}>{movie.name}</Link>}</h3>
                          </div>
                        ))}
                      </div>
                    </div> : null}
                </div>
            </div>
            <div className="right-div"></div>
        </div>
    )
}

export default Person;