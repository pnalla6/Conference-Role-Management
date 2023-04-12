import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import RegisterUser from './components/user/RegisterUser';
import LoginUser from './components/user/LoginUser';
import PrivateRoutes from './components/routes/PrivateRoutes';
import Dashboard from './components/home/Dashboard';


function App() {

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/conference/:conferenceId' element={<Home />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route path='/register' element={<RegisterUser />} />
        <Route path='/login' element={<LoginUser />} />
      </Routes>
    </>
  );
}

export default App;
