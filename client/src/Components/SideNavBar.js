import React, { useState } from 'react'
import Profile from "../Icons/profile.png";
import Options from "../Icons/options.png";
import MessageIcon from "../Icons/message.jpg";
import Cookies from 'universal-cookie';
import axios from 'axios';

function SideNavBar({
    inputEmail, setInputEmail,
    inputGroupName, setInputGroupName, friends, groups, setInputMembers, inputGroupMembers, setName, name,
    email, setEmail ,userInfo ,setUserInfo
}) {
    const [error, setError] = useState('');
    const profileContent = document.querySelector("#profile-content");
    const optionsContent = document.querySelector("#options-content");
    const messageContent = document.querySelector("#startMessage-content");
    const startMessagingContent = document.querySelector("#start-messaging-content");
    const createGroupContent = document.querySelector("#create-group-content");
    const LogoutUser = () => {
        const cookie = new Cookies();
        cookie.remove('token', { path: '/' });
        window.location = "/login";
    }
    const openProfileContent = () => profileContent.style.width = "25%";
    const closeProfileContent = () => profileContent.style.width = "0";

    const updateAccount = e => {
        e.preventDefault();
        axios.post(`${URL}/users/update`, { token: userInfo.token, email: userInfo.email, new_email: email, name: name })
            .then(res => {
                setUserInfo(res.data.user);
                const cookie = new Cookies();
                cookie.set('token', res.data.user.token, { path: '/', maxAge: 604800 })
                closeProfileContent()
            })
            .catch(() => setError("Someone has taken the email."))
    }

    const createGroup = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        axios.post(`${URL}/group/create`, { member: inputGroupMembers, owner: userInfo._id, name: inputGroupName, token })
            .then(res => {
                window.location = `/?group=${encodeURIComponent(res.data.group.code)}`
            })
            .catch(err => console.log(err.response))
    }
    const openOptionsMobile = () => {
        if (optionsContent) optionsContent.style.display = "block";
    }
    const closeOptionsMobile = () => {
        if (optionsContent) optionsContent.style.display = "none";
    }
    const startMessage = () => {
        if (messageContent) messageContent.style.display = "block";
    }
    const closeStartMessage = () => {
        if (messageContent) messageContent.style.display = "none";
    }
    const startMessaging = () => {
        if (startMessagingContent) startMessagingContent.style.width = "25%";
        closeStartMessage();
    }
    const closeStartMessaging = () => {
        if (startMessagingContent) startMessagingContent.style.width = "0"
    }
    const startCreateGroup = () => {
        if (createGroupContent) createGroupContent.style.width = "25%";
        closeStartMessage()
    }
    const closeStartCreateGroup = () => {
        if (createGroupContent) createGroupContent.style.width = "0";
    }
    const startChatting = e => {
        e.preventDefault();
        window.location = `/?to=${inputEmail}`
    }
    return (
        <div className="flex">
            <aside className="fixed left-0 top-0 h-screen bg-slate-700 p-10">
                <h1 className="text-white text-4xl">Sidebar</h1>
                <div className="sidenav">
                    <div className="top-side-nav">
                        <div className="options-dropdown">
                            <img src={Options} className="topnav-mobile-options sidenav-pp" alt="navigation bar options" onClick={() => openOptionsMobile()} />
                            <div className="options-mobile" id="options-content">
                                <p onClick={() => LogoutUser()}>Logout</p>
                                <p onClick={() => closeOptionsMobile()}>Cancel</p>
                            </div>
                        </div>
                        <img src={Profile} className="sidenav-pp" alt="Navigation bar" onClick={() => openProfileContent()} title="Profile" />
                        <div className="options-dropdown">
                            <img src={MessageIcon} className="sidenav-pp top-side-nav-right" alt="Navigation bar" onClick={() => startMessage()} title="Start Message" />
                            <div className="options-mobile" id="startMessage-content">
                                <p onClick={() => startMessaging()}>Start message</p>
                                <p onClick={() => startCreateGroup()}>Create group</p>
                                <p onClick={() => closeStartMessage()}>Cancel</p>
                            </div>
                        </div>
                        <div className="profile-content" id="start-messaging-content">
                            <form className="margin-left-right text-light" onSubmit={startChatting}>
                                <span className="closebtn" onClick={() => closeStartMessaging()}>&times;</span>
                                <h1 className="box-title">Start messaging</h1>
                                <div className="form-group autocomplete">
                                    <p className="form-label">Email:</p>
                                    <input type="text" className="form-control" id="input-email" value={inputEmail} onChange={({ target: { value } }) => setInputEmail(value)} />
                                </div>
                                <div className="form-group">
                                    <input type="submit" className="form-control btn btn-light" value="Chat!" />
                                </div>
                            </form>
                        </div>
                        <div className="profile-content" id="create-group-content">
                            <form className="margin-left-right text-light" onSubmit={createGroup}>
                                <span className="closebtn" onClick={() => closeStartCreateGroup()}>&times;</span>
                                <h1 className="box-title">Create group</h1>
                                <div className="form-group">
                                    <p className="form-label">Group name:</p>
                                    <input type="text" className="form-control" value={inputGroupName} onChange={({ target: { value } }) => setInputGroupName(value)} />
                                </div>
                                <p className="form-group form-label">Members:</p>
                                {userInfo.communications && userInfo.communications.map(user => {
                                    if (user in friends) {
                                        return <div key={user} className="form-group">
                                            <input type="checkbox" id={friends[user] && friends[user].email} value={friends[user] && friends[user].email}
                                                onChange={({ target: { checked, value } }) => {
                                                    if (checked) setInputMembers(prev => [...prev, value]);
                                                    else setInputMembers(inputGroupMembers.filter(member => member !== value))
                                                }} />
                                            <label htmlFor={friends[user] && friends[user].email}>{friends[user] && friends[user].email}</label>
                                        </div>
                                    } else return null;
                                })}
                                <div className="form-group">
                                    <input type="submit" className="form-control btn btn-dark" />
                                </div>
                            </form>
                        </div>
                        <div className="profile-content" id="profile-content">
                            <div className="margin-left-right text-light">
                                <span className="closebtn" onClick={() => closeProfileContent()}>&times;</span>
                                <h1 className="box-title">Your account:</h1>
                                <p className="form-error">{error}</p>
                                <form onSubmit={updateAccount}>
                                    <div className="form-group">
                                        <p className="form-label">Name:</p>
                                        <input className="form-control bg-light text-dark" type="text" value={name} onChange={({ target: { value } }) => setName(value)} />
                                    </div>
                                    <div className="form-group">
                                        <p className="form-label">Email:</p>
                                        <input className="form-control bg-light text-dark" type="email" value={email} onChange={({ target: { value } }) => setEmail(value)} />
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="form-control btn btn-light" value="Update" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="margin-top-bottom">
                        {console.log(userInfo)}
                        {userInfo.communications && userInfo.communications.map(user => {
                            if (user in friends && friends[user]) {
                                return <div className="sidenav-user" onClick={() => window.location = `/?to=${friends[user].email}`} key={user}>
                                    <h2 className="usernav-name">{friends[user] && friends[user].name}</h2>
                                    <h5 className="usernav-email">{friends[user] && friends[user].email}</h5>
                                </div>
                            } else if (user in groups && groups[user]) {
                                return <div key={user} className="sidenav-user" onClick={() => window.location = `/?group=${encodeURIComponent(groups[user].code)}`}>
                                    <h2 className="usernav-name">{groups[user] && groups[user].name}</h2>
                                    <h5 className="usernav-email">{groups[user] && groups[user].member.length + 1} {groups[user].member.length + 1 > 1 ? <span>members</span> : <span>member</span>}</h5>
                                </div>
                            } else return null;
                        })}
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default SideNavBar