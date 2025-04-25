import '../styles/login.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);

      if (!snap.exists() || snap.data().role !== 'admin') {
        await signOut(auth);
        setLoading(false);
        setError("Access denied: Not an admin.");
        return;
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      setLoading(false);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className='logo'>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <h1>Admin Login</h1>

      <div className="login-form">
        <div className="input-wrapper">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="input-wrapper">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      <p className='forgot-text'>Forgot password?</p>

      <button className="login-btn" onClick={handleLogin} disabled={loading}>
        {loading ? (
          <>
            Logging in <span className="spinner"></span>
          </>
        ) : (
          <>
            Continue <FontAwesomeIcon icon={faArrowRight} className='arrow-icon' />
          </>
        )}
      </button>
    </div>
  );
}

export default Login;
