import React, {useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import LoginForm from "./loginForm";


const Login = () => {
    let routingHistory = useHistory();

    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setLoginDetails({
            ...loginDetails,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const userData = {
            email: loginDetails.email,
            password: loginDetails.password
        };
        axios
            .post('/login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                setLoading(false);
                routingHistory.push('/');
            })
            .catch((error) => {
                console.log(error);
                setErrors(error.response.data);
                setLoading(false)
            });
    };

    return (
        <LoginForm
            loginDetails={loginDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
            loading={loading}
        />
    )
}

export default Login;