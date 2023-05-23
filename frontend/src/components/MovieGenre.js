import React, {useState, useEffect} from 'react'
import {useSearchParams, useLocation, Link, useParams, useNavigate} from 'react-router-dom';
import fetchservice from "../services/fetch.service";
import './movie.css'

const MovieGenre = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const state = useLocation()

    useEffect(() => {
        const fetchData = async () => {
        try {
            const getGenres = await fetchservice.getMoviesGenresInfo()
            setGenres(getGenres.data)
            console.log(id)
            const page = searchParams.get("page")
            const res = await fetchservice.getMoviesInfoByGenre(id, page ? page : 1)
            setMovies(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    fetchData()
    }, [state])

    if (movies.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="movies">
            <div className="content-wrapper">
                <div className="movies-container">
                    {movies.results.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                            {/*<img src={movie.posterUrl} alt={movie.title} />*/}
                            <div className="movie-card-details">
                                <Link to={`/movie/${movie.id}`}>
                                    <h2>{movie.title} ({movie.release_date?.split("-").slice(0, -2)})</h2>
                                </Link>
                                <p className="text">{movie.overview}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="page-change-buttons">
                    {movies.page !== 1 &&
                        <Link to={`/movies/genres/${id}?page=${movies.page - 1}`}>
                            <input className="btn btn-danger" type="submit" value={movies.page - 1}/>
                        </Link>
                    }
                    {movies.page < movies.total_pages &&

                        <Link to={`/movies/genres/${id}?page=${movies.page + 1}`}>
                            <input className="btn btn-primary" type="submit" value={movies.page + 1}/>
                        </Link>
                    }
                </div>
            </div>
           <div className="search">
                <div className="genres">
                    <h3>Genre</h3>
                        <ul>
                            {genres.genres.map((genre) => (
                                  <li key={genre.id}><a href={`/movies/genres/${genre.id}`}>{genre.name}</a></li>
                            ))}
                        </ul>
                </div>
           </div>
        </div>
    )
}

export default MovieGenre