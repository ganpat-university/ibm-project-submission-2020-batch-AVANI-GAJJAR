import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import Prediction from './pages/Prediction';
import Statistics from './pages/Statistics';
import OtpVerification from './Components/OtpVerification';
import Report from './pages/Report';
function App() {
  const token = localStorage.getItem('token')
  const verify = localStorage.getItem('isVerified')
  const path = window.location.pathname
  if(token && verify === "false" && path!=="/verify"){
    window.location.replace('/verify')
  }
  if(!token && verify === "false"){
    window.location.replace('/login')
  }
  return (
    <div className="App">
     <Router>
        <Routes>
          <Route path="/" element={token?<Navigate to="/dashboard" />:<Navigate to="/predict" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/verify" element={<OtpVerification />} />
          <Route path="/report" element={<Report />} />
        </Routes>
     </Router>
    </div>
  );
}

export default App;
