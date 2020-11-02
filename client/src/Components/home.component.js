import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import getUserByToken from '../Library/getUserByToken';
import Profile from "../Icons/profile.png";
import Logout from "../Icons/logout.png";
import Options from "../Icons/options.png";
import Axios from 'axios';
import URL from '../Static/Backend.url.static';

const Home = () => {
    const [userInfo, setUserInfo] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [width, setWidth] = useState(0);
    const profileContent = document.querySelector("#profile-content");
    const optionsContent = document.querySelector("#options-content");
    const overlayContent = document.querySelector("#overlay-content")

    useEffect(() => {
        const token = new Cookies().get('token');
        getUserByToken(token).then(res => {
            if(res){
                if(res.status) window.location = "/login";
                else {
                    setUserInfo(res);
                    const cookie = new Cookies();
                    cookie.set('token', res.token, {path: '/', maxAge:604800 })
                }
            }else window.location = "/login";
        })
    }, [])

    useEffect(() => {
        if(userInfo.name) setName(userInfo.name)
        if(userInfo.email) setEmail(userInfo.email)
    }, [userInfo])

    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener('resize', () => setWidth(window.innerWidth))
    }, [])

    const openProfileContent = () => profileContent.style.width = "25%";
    const closeProfileContent = () => profileContent.style.width = "0";

    const updateAccount = e => {
        e.preventDefault();
        Axios.post(`${URL}/users/update`, {token: userInfo.token, email: userInfo.email, new_email: email, name: name})
        .then(res => {
            setUserInfo(res.data.user);
            const cookie = new Cookies();
            cookie.set('token', res.data.user.token, {path: '/', maxAge:604800 })
            closeProfileContent()
        })
        .catch(() => setError("Someone has taken the email."))
    }

    const LogoutUser = () => {
        const cookie = new Cookies();
        cookie.remove('token', {path: '/'});
        window.location = "/login";
    }

    const openOptionsMobile = () => {
        if(optionsContent) optionsContent.style.display = "block";
    }
    const closeOptionsMobile = () => {
        if(optionsContent) optionsContent.style.display = "none";
    }

    const openOverlayMobile = () => {
        if(overlayContent) overlayContent.style.width = "100%";
        closeOptionsMobile()
    }
    const closeOverlayMobile = () => {
        if(overlayContent) overlayContent.style.width = "0";
    }

    return(
        <div className = "container-fluid">
            {width > 900 ?
            <div>
                <div className="sidenav">
                    <div className="top-side-nav">
                        <img src = {Profile} className="sidenav-pp" alt="Navigation bar" onClick = {() => openProfileContent()} title="Profile" />
                        <img src = {Logout} className="sidenav-pp" alt="Navigation bar logout icon" title = "Logout" onClick = {() => LogoutUser()} />
                        <div className="profile-content" id="profile-content">
                            <div className="margin-left-right text-light">
                                <span className="closebtn" onClick = {() => closeProfileContent()}>&times;</span>
                                <h1 className="box-title">Your account:</h1>
                                <p className="form-error">{error}</p>
                                <form onSubmit = {updateAccount}>
                                    <div className="form-group">
                                        <p className="form-label">Name:</p>
                                        <input className="form-control bg-light text-dark" type="text" value={name} onChange = {({target: {value}}) => setName(value)} />
                                    </div>
                                    <div className="form-group">
                                        <p className="form-label">Email:</p>
                                        <input className="form-control bg-light text-dark" type = "email" value = {email} onChange = {({target: {value}}) => setEmail(value)} />
                                    </div>
                                    <div className="form-group">
                                        <input type = "submit" className="form-control btn btn-light" value="Update" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main">

                </div>
            </div>
            :<div>
                <div className="topnav-mobile">
                    <span className='topnav-mobile-title'>Whatsapp clone</span>
                    <div className="options-dropdown">
                        <img src = {Options} className="topnav-mobile-options sidenav-pp" alt="navigation bar options" onClick = {() => openOptionsMobile()} />
                        <div className="options-mobile" id="options-content">
                            <p onClick = {() => openOverlayMobile()}>Profile</p>
                            <p onClick = {() => LogoutUser()}>Logout</p>
                            <p onClick = {() => closeOptionsMobile()}>Cancel</p>
                        </div>
                    </div>
                    <div className="mobile-overlay" id="overlay-content">
                        <span className="mobile-overlay-closeBtn text-light" onClick = {() => closeOverlayMobile()}>&times;</span>
                        <div className="mobile-overlay-content">
                            <div className="form-group">
                                <h1 className="box-title text-light">Your account:</h1>
                            </div>
                            <form onSubmit = {updateAccount}>
                                <div className="form-group">
                                    <p className="form-label text-light">Name:</p>
                                    <input className="form-control bg-light text-dark" type="text" value={name} onChange = {({target: {value}}) => setName(value)} />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-light">Email:</p>
                                    <input className="form-control bg-light text-dark" type = "email" value = {email} onChange = {({target: {value}}) => setEmail(value)} />
                                </div>
                                <div className="form-group">
                                    <input type = "submit" className="form-control btn btn-light" value="Update" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="main-mobile">
                </div>
            </div>}
        </div>
    )
}

export default Home;