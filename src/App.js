import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import RegisterUser from './components/user/RegisterUser';
import LoginUser from './components/user/LoginUser';
import PrivateRoutes from './components/routes/PrivateRoutes';
import Dashboard from './components/home/Dashboard';
import NotFound from './components/404/NotFound';
import Landing from './components/home/Landing';


function App() {

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path='/conference/:conferenceId' element={<Home />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route exact path='/' element={<Landing />} />
        <Route exact path='/home' element={<Landing />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/login' element={<LoginUser />} />

        <Route path='*' element={<NotFound />} /> {/* this matches any other path */}
      </Routes>
    </>
  );
}

export default App;
