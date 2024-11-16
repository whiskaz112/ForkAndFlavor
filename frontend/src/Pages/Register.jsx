import React, { useEffect, useState } from "react";
import FormInput from "../Components/FormInput";
import BtnBack from "../Components/BtnBack";
import { Link, useNavigate } from "react-router-dom";
// import { useUserAuth } from "../context/UserAuthContext";
import axios from 'axios'

function Register (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    // const {signUp} = useUserAuth();

    let navigate = useNavigate();

    const sendRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                email,
                password
            });
            if (response.data.success) {
                console.log("Register Success!");
                // Handle successful registration (e.g., navigate to login page)
                navigate("/Login");
            } else {
                // Handle errors returned from the backend
                setError(response.data.message);
            }   
            console.log("response: ", response)
        } catch (err) {
            setError("An error occurred while registering. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="Register__Page">
            <div className="Register__field">
                <BtnBack path={-1}/>
                <header><h1 className="fredoka">Create an <br/>account</h1></header>
                <form className="Register__form" onSubmit={sendRegister}>
                    <FormInput
                        label = "username"
                        name = "username"
                        type = "text"
                        onChange = {(e) => setUsername(e.target.value)}
                    />
                    <FormInput
                        label = "email"
                        name = "email"
                        type = "text"
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                    <FormInput
                        label = "password"
                        name = "password"
                        type = "password"
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="Register__btn noto-sans-thai-looped-bold">Join now</button>
                </form>
            </div>
            <div className="Register__bg"></div>
        </div>
    )
}

export default Register