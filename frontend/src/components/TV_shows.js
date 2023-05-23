import React, {useState, useEffect} from 'react'
import {useSearchParams, useLocation, Link, useNavigate} from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import fetchservice from "../services/fetch.service";
import './tv.css'


const TVShows = () => {
    const [search, setSearch] = useState({})
    const [tvShows, settvShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [searchParams] = useSearchParams()
    const state = useLocation()
    const navigate = useNavigate()


    const tv_name = searchParams.get("name")
    let parametr
    if (tv_name) {
         parametr = `?name=${tv_name}&`
    } else {
         parametr = `?`
    }

    useEffect(() => {
        const fetchData = async () => {
        try {
            const getGenres = await fetchservice.getTVGenresInfo()
            setGenres(getGenres.data)
            const tv_name = searchParams.get("name")
            if (tv_name) {
                const page = searchParams.get("page")
                const res = await fetchservice.getTVInfoByName(tv_name.replace(' ', '%20'), page ? page : 1)
                settvShows(res.data)
            } else {
                const page = searchParams.get("page")
                const res = await fetchservice.getNewPopularTVInfo(page ? page : 1)
                settvShows(res.data)
            }

        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
    }, [state])

    if (tvShows.length === 0) {
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
                navigate(`/tv?name=${search.searchName}`)
            } else {
                const page = searchParams.get("page")
                const res = await fetchservice.getNewPopularTVInfo(page ? page : 1)
                settvShows(res.data)
            }
        } catch (error) {
            console.log(error)
        }
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
                        <Link to={window.location.pathname+parametr+`page=${tvShows.page - 1}`}>
                            <input className="btn btn-danger" type="submit" value={tvShows.page - 1}/>
                        </Link>
                    }
                    {tvShows.page < tvShows.total_pages &&
                        <Link to={window.location.pathname+parametr+`page=${tvShows.page + 1}`}>
                            <input className="btn btn-primary" type="submit" value={tvShows.page + 1}/>
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
                                  <li key={genre.id}><a href={`/tv/genres/${genre.id}`}>{genre.name}</a></li>
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
        </div>
    )
}

export default TVShows