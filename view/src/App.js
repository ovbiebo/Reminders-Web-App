import './App.css';

import login from './pages/login';
import signup from './pages/signup';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path={"/login"} component={login}/>
                    <Route path={"/signup"} component={signup}/>
                    <Route path={"/"}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
