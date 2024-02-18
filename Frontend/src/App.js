import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import Home from './components/Home'
import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home} />
      <Redirect to="/not-found"/>
    </Switch>
  </BrowserRouter>
    
)

export default App;