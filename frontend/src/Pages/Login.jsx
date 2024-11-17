import React, { useState } from 'react';
import FormInput from '../Components/FormInput';
import BtnBack from '../Components/BtnBack';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logIn } = useUserAuth();

  let navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setError("");
  //     try{
  //         await logIn(email, password);
  //         navigate("/");
  //     }catch(err){
  //         setError(err.message);
  //         console.log(err)
  //     }
  // }

  const sendLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        console.log('Login Success!');
        // Handle successful registration (e.g., navigate to login page)
        // navigate("/");
      } else {
        // Handle errors returned from the backend
        setError(response.data.message);
      }
      console.log('response: ', response);
    } catch (err) {
      setError('An error occurred while loging in. Please try again.');
      console.error(err);
    }
  };
  return (
    <div className="Login__Page">
      <div className="Login__bg"></div>
      <div className="Login__field">
        <BtnBack path={-1} />
        <header>
          <img
            className="Login__Logo"
            src="../../public/Image/Logo/Logo.svg"
            alt="logo_ForkAndFlavor"
          />
        </header>
        <form className="Login__form" onSubmit={sendLogin}>
          <FormInput
            label="email"
            name="email"
            type="text"
            onChange={e => setEmail(e.target.value)}
          />
          <FormInput
            label="password"
            name="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="Login__btn noto-sans-thai-looped-bold"
          >
            Log In
          </button>
        </form>
        <p className="noto-sans-thai-looped-bold">
          don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

