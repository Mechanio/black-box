import axios from "axios"

const getMoviesInfoByName = (name, page) => {
    return axios.get(`http://localhost:5000/api/search_movies?name=${name}&page=${page}`)
}

const getNewPopularMoviesInfo = (page) => {
    return axios.get(`http://localhost:5000/api/new_popular_movies?page=${page}`)
}

const getMovieInfoById = (id_) => {
    return axios.get(`http://localhost:5000/api/movie/${id_}`)
}

const getMoviesInfoByGenre = (id_, page) => {
    return axios.get(`http://localhost:5000/api/movies/genre/${id_}?page=${page}`)
}

const getTVInfoByGenre = (id_, page) => {
    return axios.get(`http://localhost:5000/api/tv/genre/${id_}?page=${page}`)
}

const getPersonInfoById = (id_) => {
    return axios.get(`http://localhost:5000/api/person/${id_}`)
}

const getTVInfoByName = (name, page) => {
    return axios.get(`http://localhost:5000/api/search_tv?name=${name}&page=${page}`)
}

const getNewPopularTVInfo = (page) => {
    return axios.get(`http://localhost:5000/api/new_popular_tv?page=${page}`)
}

const getTVInfoById = (id_) => {
    return axios.get(`http://localhost:5000/api/tv/${id_}`)
}

const getProfileInfo = () => {
    return axios.get(`http://localhost:5000/api/users/current`)
}

const getMoviesGenresInfo = () => {
    return axios.get(`http://localhost:5000/api/movies/genres`)
}

const getTVGenresInfo = () => {
    return axios.get(`http://localhost:5000/api/tv/genres`)
}
const getKeywordInfo = (keyword) => {
    return axios.get(`http://localhost:5000/api/keywords?keyword=${keyword}`)
}

const fetchservice = {
    getMoviesInfoByName,
    getNewPopularMoviesInfo,
    getMovieInfoById,
    getMoviesInfoByGenre,
    getPersonInfoById,
    getTVInfoByName,
    getNewPopularTVInfo,
    getTVInfoById,
    getProfileInfo,
    getMoviesGenresInfo,
    getTVGenresInfo,
    getKeywordInfo,
    getTVInfoByGenre,
}

export default fetchservice
