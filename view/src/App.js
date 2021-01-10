import './App.css';

import Login from './pages/login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path={"/login"} component={Login}/>
                    <Route path={"/"}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
