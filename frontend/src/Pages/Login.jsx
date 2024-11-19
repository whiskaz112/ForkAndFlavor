import React, { useState } from 'react';
import FormInput from '../Components/FormInput';
import BtnBack from '../Components/BtnBack';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../auth/authSlice';
import { useDispatch } from 'react-redux';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { logIn } = useUserAuth();
  const dispatch = useDispatch();
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
        dispatch(loginSuccess());
        navigate("/");
      } else {
        setError(response.data.message);
        console.log(error);
      }
      console.log('response: ', response);
    } catch (err) {
      setError('An error occurred while loging in. Please try again.');
      console.error(err);
    }
  };

  // const [postImage, setPostImage] = useState({ myFile: null });
  // const [user, setUser] = useState(null); // Add state for user data

  // const sendImage = async () => {
  //   try {
  //     const formData = new FormData();
  //     console.log(formData)
  //     formData.append('myFile', postImage.myFile);

  //     const user = await axios.get('http://localhost:5000/api/getUser', {
  //       withCredentials: true
  //     });
  //     console.log('user:', user)
  //     console.log('userId: ', user.data._id)

  //     setUser(user.data); // Set user data
  //     formData.append('userId', user.data._id); // Append userId to the formData
  
  //     const response = await axios.post('http://localhost:5000/api/uploadPic', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log(response)
  
  //     console.log('Image uploaded successfully');
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };
  
  // const uploadSubmit = (e) => {
  //   e.preventDefault();
  //   if (postImage.myFile) {
  //     sendImage();
  //   } else {
  //     console.error('No file selected for upload');
  //   }
  // };
  
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   setPostImage({ myFile: file });
  // };

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

      {/* Test upload image */}
      {/* <form onSubmit={uploadSubmit}>
        {user && <img src={user.profilePicPath} alt="Profile" />}
        <label htmlFor="file-upload">Upload</label>
        <input
          type="file"
          lable="Image"
          name="myFile"
          id="file-upload"
          accept=".jpeg, .png, .jpg"
          onChange={(e) => handleFileUpload(e)}
        />
        <button type="submit">Submit</button>
      </form> */}

    </div>
  );
}

export default Login;

// function convertToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = error => {
//       reject(error);
//     };
//   });
// }
