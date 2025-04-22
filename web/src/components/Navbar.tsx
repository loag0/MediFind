import '../styles/navbar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard">
        <img src={logo} alt="MediFind Logo" className="navbar-logo" />
        </Link>
        
      </div>
      
      <div className="navbar-right">
        <div className="add-doctor">
        <Link to="/add-doctor" className="navbar-link">Add Doctor
        <FontAwesomeIcon icon={faPlus} className="add-icon"/>
        </Link>
        </div>
        
        <Link to="/admin-account" className="navbar-icon">
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>
    </nav>
  );
}
