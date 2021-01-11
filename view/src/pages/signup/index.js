import React, {useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import LoginForm from "./signupForm";


const Signup = () => {
    let routingHistory = useHistory();

    const [signupDetails, setSignupDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setSignupDetails({
            ...signupDetails,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const newUserData = {
            firstName: signupDetails.firstName,
            lastName: signupDetails.lastName,
            phoneNumber: signupDetails.phoneNumber,
            country: signupDetails.country,
            username: signupDetails.username,
            email: signupDetails.email,
            password: signupDetails.password,
            confirmPassword: signupDetails.confirmPassword
        };
        axios
            .post('/register', newUserData)
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
            signupDetails={signupDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
            loading={loading}
        />
    )
}

export default Signup;