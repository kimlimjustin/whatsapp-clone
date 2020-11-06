import React, { useEffect, useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { NavLink } from "react-router-dom";
import getUserByToken from "../Library/getUserByToken";

const URL = process.env.REACT_APP_BACKEND_URL
const Login = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        getUserByToken(token).then(res => {
            if(res && !res.status){
                const token = new Cookies();
                token.set('token', res.token, {path: '/', maxAge:604800 })
                window.location = "/";
            }
        })
    }, [])

    const Submit = (e) => {
        e.preventDefault();

        Axios.post(`${URL}/users/login`, {email: inputEmail, password: inputPassword})
        .then(res => {
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
            window.location = "/";
        })
        .catch(() => setError("Something went wrong. Please try again."))
    }

    return(
        <div className="container">
            <form className="margin box box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Login user</h1>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    <p className="form-label">Email:</p>
                    <input type="email" className="form-control" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input type="password" className="form-control" value={inputPassword} onChange= {({target: {value}}) => setInputPassword(value)} />
                </div>
                <div className="form-group">
                    <p className = "form-label">Don't have account yet? <NavLink to="/register" className="link">Register</NavLink></p>
                </div>
                <div className="form-group">
                    <input type="submit"  className="form-control btn btn-dark" />
                </div>
            </form>
        </div>
    )
}

export default Login;