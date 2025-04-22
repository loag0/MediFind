import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddDoctor from './pages/AddDoctor';
import UserProfile from './pages/UserProfile';
import EditDoctor from './pages/EditDoctor';
import AdminAccount from './pages/AdminAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-doctor" element={<AddDoctor />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/edit-doctor/:id" element={<EditDoctor />} />
      <Route path="/admin-account" element={<AdminAccount />} /> 
    </Routes>
  );
}

export default App;
