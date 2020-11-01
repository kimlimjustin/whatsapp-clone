import React from "react";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./Components/home.component";
import Login from "./Components/login.component";
import Register from "./Components/register.component";

const App = () => (
    <Router>
        <Switch>
            <Route exact path = "/" component = {Home} />
            <Route path = "/register" component = {Register} />
            <Route path = "/login" component = {Login} />
        </Switch>
    </Router>
)

export default App;