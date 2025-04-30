import '../styles/adminAccount.css';
import { useState } from 'react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import NavBar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AdminAccount() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPass);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        setMessage('✅ Password updated successfully.');
      } catch (err) {
        console.error(err);
        setMessage('❌ Failed to update password. Check current password.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/', { replace: true });
  };

  return (
    <div className="admin-account-page">
      <NavBar />
      <div className="account-box">
        <h1>Admin Account</h1>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPass}
          onChange={e => setCurrentPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />
        <button className="change-btn" onClick={handleChangePassword}>Change Password</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
