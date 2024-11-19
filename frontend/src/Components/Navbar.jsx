import React from 'react';
import Searchbar from "./Searchbar";
import BtnLetter from "./BtnLetter";
import BtnBox from "./BtnBox";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
function Navbar() {

    const user = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigateToProfile = (view) => {
        navigate('/MyProfile', { state: { view } });
    };

    const handleLogout = async (e) => {
        // e.preventDefault();
        try {
            const response = await axios.get(
                'http://localhost:5000/api/logout'
                , 
                {
                    withCredentials: true, 
                }
            );

            if (response.status === 200) {
                console.log('Logout successful');
                dispatch(logout()); 
            } else {
                console.log('Logout failed:', response.data.message);
            }
            console.log('response: ', response);
        } catch (err) {
            console.error('Error during logout:', err.message);
        }
    };

    return (
        <div className="Navbar">
            <div className="Navbar__Logo">
                <Link to="/"><img src="../../public/Image/Logo/Logo.svg" alt="logo_ForkAndFlavor" /></Link>
            </div>
            <div className="Navbar__Searchbar"><Searchbar /></div>
            {
                user ?
                    <div className="Navbar__routeLogin">
                        <Link to="/createpost"><img id="Icon__createPost" src="./../../public/Image/Icon/create post.svg" alt="Create Post" /></Link>
                        <img id="Icon__bookmark" src="./../../public/Image/Icon/bookmark.svg" alt="Bookmark" onClick={() => navigateToProfile('bookmark')} />
                        <BtnLetter
                            name="Profile"
                            onClick={() => navigateToProfile('posts')}
                        />
                        <BtnLetter
                            name="Log out"
                            onClick={handleLogout}
                        />
                    </div>
                    :
                    <div className="Navbar__route">
                        <Link to="/login"><BtnLetter name="Log in" /></Link>
                        <Link to="/register"><BtnBox name="Sign up" /></Link>
                    </div>
            }
        </div>
    );
}

export default Navbar;