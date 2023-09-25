import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/Login.css';  // Import the CSS 

const BACKEND_URL="https://order-taker-back-5416a0177bda.herokuapp.com";

// Create an axios instance with the base URL and withCredentials set to true
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

const Login = () => { 
  const navigate = useNavigate(); 
  const role = localStorage.getItem('role');

  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [forgotEmail, setForgotEmail] = useState(''); 
  const [forgotRole, setForgotRole] = useState(''); 
  const [showForgotPassword, setShowForgotPassword] = useState(false); 

  useEffect(() => {
    if (role) {
        switch (role) {
            case 'admin':
                navigate('/AdminDashboard');
                break;
            case 'developer':
                navigate('/DeveloperDashboard');
                break;
            case 'accountant':
                navigate('/AccountantDashboard');
                break;
            case 'cashier':
                navigate('/CashierDashboard');
                break;
            case 'waiter':
                navigate('/WaiterDashboard');
                break;
            default:
                break;
        }
    }
  }, [role, navigate]);

  const handleLogin = async () => { 
    setLoading(true); 
    setError(null); 

    try { 
      const response = await api.post('/api/users/authenticate', { 
        email, 
        password, 
      }); 
      console.log('Response:', response);  // Log the response 

      const token = response.data.token; 
      localStorage.setItem('token', token); 
      localStorage.setItem('role', response.data.role); 

      setLoading(false); 
      console.log('Logged in successfully'); 
      console.log('Role:', response.data.role);

      // Refresh the page
      window.location.reload();

      // Redirect based on role
      switch(response.data.role) {
        case 'admin':
            navigate('/AdminDashboard');
            break;
        case 'accountant':
            navigate('/AccountantDashboard');
            break;
        case 'developer':
            navigate('/DeveloperDashboard');
            break;
        case 'cashier':
            navigate('/CashierDashboard');
            break;
        case 'waiter':
            navigate('/WaiterDashboard');
            break;
        default:
            navigate('/');  // Default redirection if role is not recognized
      }


    } catch (error) { 
      setLoading(false); 
      setError('Invalid credentials or error logging in.'); 
      console.log('Error during login', error); 
    } 
  }; 

  const handleForgotPassword = async () => { 
    try { 
      await api.post('/forgot-password', { 
        email: forgotEmail, 
        role: forgotRole, 
      }); 
      alert('If the information is correct and if approved, an email will be sent with instructions on how to reset the password. You can also contact your admin directly if you need a faster response.'); 
    } catch (error) { 
      console.log('Error during forgot password', error); 
    } 
  }; 

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>

      { !showForgotPassword ? ( 
        <div className="login-form">
          {/* Logo */}
          <img src={`${process.env.PUBLIC_URL}/imavrithalassa_logo.jpg`} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
        
          {/* Login form */}
          <h1>Login</h1>
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <div className="forgot-password-section">
          <h2>Forgot Password?</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
            <label>
              Email:
              <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            </label>
            <br />
            <label>
              Role:
              <input type="text" value={forgotRole} onChange={(e) => setForgotRole(e.target.value)} />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <button onClick={() => setShowForgotPassword(!showForgotPassword)}>
        {showForgotPassword ? 'Back to Login' : 'Forgot Password?'}
      </button>
    </div>
  );
}; 

export default Login;
