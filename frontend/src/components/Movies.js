import React, {useState, useEffect} from 'react'
import {useSearchParams, useLocation, Link, useNavigate} from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import fetchservice from "../services/fetch.service";
import './movie.css'
import authService from "../services/auth.service";


const Movies = () => {
    const [search, setSearch] = useState({})
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [searchParams] = useSearchParams()
    const state = useLocation()
    const navigate = useNavigate()

    const movie_name = searchParams.get("name")
    let parametr
    if (movie_name) {
         parametr = `?name=${movie_name}&`
    } else {
         parametr = `?`
    }


    useEffect(() => {
        const fetchData = async () => {
        try {
            console.log(window.location.search)
            const getGenres = await fetchservice.getMoviesGenresInfo()
            setGenres(getGenres.data)
            const movie_name = searchParams.get("name")
            if (movie_name) {
                const page = searchParams.get("page")
                const res = await fetchservice.getMoviesInfoByName(movie_name.replace(' ', '%20'), page ? page : 1)
                setMovies(res.data)
            } else {
                const page = searchParams.get("page")
                const res = await fetchservice.getNewPopularMoviesInfo(page ? page : 1)
                setMovies(res.data)
            }

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [state])

    if (movies.length === 0) {
        return <div>Loading...</div>;
    }

    async function keywordChange(value) {
        if (value) {
            const getKeywords = await fetchservice.getKeywordInfo(value)
            setKeywords(getKeywords.data.results.slice(0, 5))
            console.log(keywords);
        }
    }

    async function selectedKeywordChange(value) {
        setSelectedKeywords((prevSelectedKeywords) => [...prevSelectedKeywords, value])
        console.log(selectedKeywords)
    }
    async function selectedKeywordRemove(valueToRemove) {
        const updatedArray = selectedKeywords.filter((value) => value !== valueToRemove);
        setSelectedKeywords(updatedArray)
        console.log(selectedKeywords)
    }


    const handleClick = async (event) => {
        event.preventDefault()
        try {
            if (search) {
                console.log(search)
                navigate(`/movies?name=${search.searchName}`)
            } else {
                const page = searchParams.get("page")
                const res = await fetchservice.getNewPopularMoviesInfo(page ? page : 1)
                setMovies(res.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="movies">
            <div className="content-wrapper">
                <div className="movies-container">
                {movies.results.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <Link to={`/movie/${movie.id}`}>
                                <img className="movie-card-poster" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                            </Link>
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
                        <Link to={window.location.pathname+parametr+`page=${movies.page - 1}`}>
                            <input className="btn btn-danger" type="submit" value={movies.page - 1}/>
                        </Link>
                    }
                    {movies.page < movies.total_pages &&
                        <Link to={window.location.pathname+parametr+`page=${movies.page + 1}`}>
                            <input className="btn btn-primary" type="submit" value={movies.page + 1}/>
                        </Link>
                    }
                </div>
            </div>
            <div className="search">
                <div className="name">
                    <h2>Search by...</h2>
                </div>
                <div className="by-name"><h3>Name</h3></div>
                <input className="form-control" type="search"
                       onChange={(e) => setSearch({...search, searchName: e.target.value})}/>
                <div className="genres">
                    <h3>Genre</h3>
                        <ul>
                            {genres.genres.map((genre) => (
                                  <li key={genre.id}><a href={`/movies/genres/${genre.id}`}>{genre.name}</a></li>
                            ))}
                        </ul>
                </div>
                <div>
                    <h3>Keywords</h3>
                    <Multiselect
                        options={keywords}
                        onSearch={keywordChange}
                        onSelect={selectedKeywordChange}
                        onRemove={selectedKeywordRemove}
                        displayValue='name'
                    />
                </div>
                <div>
                    <button className="btn btn-primary page-change-buttons" type="submit" onClick={handleClick}>Search</button>
                </div>
            </div>
        {/*<Multiselect*/}
        {/*    options={keywords}*/}
        {/*    onSearch={keywordChange}*/}

        {/*    displayValue="name"*/}
        {/*/>*/}
        </div>
    )
}

export default Movies