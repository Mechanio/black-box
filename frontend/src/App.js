import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import authService from "./services/auth.service";
import {useEffect} from "react";
import MyNavbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.css'
import Movie from "./components/Movie"
import Movies from "./components/Movies";
import MovieGenre from "./components/MovieGenre";
import TVGenre from "./components/TVGenre";
import Person from "./components/Person";
import TV_Show from "./components/TV_show";
import Login from './Auth/Login'
import Profile from './Profile'
import TVShows from "./components/TV_shows";
import User from "./components/User";
import Register from "./Auth/Register";

function App() {
    const {pathname} = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        authService.authGuard(pathname, navigate)
    }, [pathname])

    return (
        <div>
            <MyNavbar/>
            <div className="content">
                <Routes>
                    <Route exact path="/"/>
                    <Route exact path="/auth/login" element={<Login/>}/>
                    <Route exact path="/auth/registration" element={<Register/>}/>
                    <Route exact path="/profile" element={<Profile/>}/>
                    <Route exact path="/user/:id" element={<User/>}/>
                    <Route exact path="/movie/:id" element={<Movie/>}/>
                    <Route exact path="/person/:id" element={<Person/>}/>
                    <Route exact path="/movies" element={<Movies/>}/>
                    <Route exact path="/tv" element={<TVShows/>}/>
                    <Route exact path="/tv/:id" element={<TV_Show/>}/>
                    <Route exact path="/movies/genres/:id" element={<MovieGenre/>}/>
                    <Route exact path="/tv/genres/:id" element={<TVGenre/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default App;
