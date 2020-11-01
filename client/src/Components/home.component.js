import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import getUserByToken from '../Library/getUserByToken';
import Profile from "../Icons/profile.png"
import Axios from 'axios';
import URL from '../Static/Backend.url.static';

const Home = () => {
    const [userInfo, setUserInfo] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const profileContent = document.querySelector("#profile-content")

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

    return(
        <div className = "container-fluid">
            <div className="sidenav">
                <div className="top-side-nav">
                    <img src = {Profile} className="sidenav-pp" alt="Navigation bar" onClick = {() => openProfileContent()} />
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
    )
}

export default Home;