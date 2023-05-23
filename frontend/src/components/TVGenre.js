import React, {useState, useEffect} from 'react'
import {useSearchParams, useLocation, Link, useParams, useNavigate} from 'react-router-dom';
import fetchservice from "../services/fetch.service";
import './movie.css'

const TVGenre = () => {
    const [tvShows, setTvShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const state = useLocation()

    useEffect(() => {
        const fetchData = async () => {
        try {
            const getGenres = await fetchservice.getTVGenresInfo()
            setGenres(getGenres.data)
            console.log(id)
            const page = searchParams.get("page")
            const res = await fetchservice.getTVInfoByGenre(id, page ? page : 1)
            setTvShows(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    fetchData()
    }, [state])

    if (tvShows.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="tv-shows">
            <div className="content-wrapper">
                <div className="tv-container">
                    {tvShows.results.map((tv) => (
                        <div key={tv.id} className="tv-card">
                            <Link to={`/tv/${tv.id}`}>
                                <img src={`https://image.tmdb.org/t/p/original/${tv.poster_path}`} onError={(e) => {e.target.onerror = null; e.target.src='/notfound.png'}}/>
                            </Link>
                            <div className="tv-card-details">
                                <Link to={`/tv/${tv.id}`}>
                                    <h2>{tv.name} ({tv.first_air_date?.split("-").slice(0, -2)}-)</h2>
                                </Link>
                                <p className="text">{tv.overview}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="page-change-buttons">
                    {tvShows.page !== 1 &&
                        <Link to={`/tv/genres/${id}?page=${tvShows.page - 1}`}>
                            <input className="btn btn-danger" type="submit" value={tvShows.page - 1}/>
                        </Link>
                    }
                    {tvShows.page < tvShows.total_pages &&

                        <Link to={`/tv/genres/${id}?page=${tvShows.page + 1}`}>
                            <input className="btn btn-primary" type="submit" value={tvShows.page + 1}/>
                        </Link>
                    }
                </div>
            </div>
           <div className="search">
                <div className="genres">
                    <h3>Genre</h3>
                        <ul>
                            {genres.genres.map((genre) => (
                                  <li key={genre.id}><a href={`/tv/genres/${genre.id}`}>{genre.name}</a></li>
                            ))}
                        </ul>
                </div>
           </div>
        </div>
    )
}

export default TVGenre