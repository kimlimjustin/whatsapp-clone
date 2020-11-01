import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import getUserByToken from '../Library/getUserByToken';

const Home = () => {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const token = new Cookies().get('token');
        getUserByToken(token).then(res => {
            if(res.status) window.location = "/login";
            else {
                setUserInfo(res);
                const cookie = new Cookies();
                cookie.set('token', res.token, {path: '/', maxAge:604800 })
            }
        })
    }, [])
    return(
        <div className = "container">

        </div>
    )
}

export default Home;