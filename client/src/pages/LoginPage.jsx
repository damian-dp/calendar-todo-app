import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginStyles.css";

const LoginPage = () => {
	console.log("LoginPage is rendering");
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const endpoint = isLogin ? `${apiUrl}/api/users/login` : `${apiUrl}/api/users/signup`;

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				if (isLogin) {
					localStorage.setItem("token", data.token);
					navigate("/calendar");
				} else {
					setMessage(
						"User created. Please check your email to verify your account."
					);
				}
			} else {
				setMessage(data.message || "Authentication failed");
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage("An error occurred. Please try again.");
		}
	};

	return (
		<div className="login-container">
			<h2>{isLogin ? "Login" : "Register"}</h2>
			{message && <p className="message">{message}</p>}
			<form className="login-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="submit-button" type="submit">
					{isLogin ? "Login" : "Register"}
				</button>
				<button
					className="switch-form-button" type="button"
					onClick={() => setIsLogin(!isLogin)}
				>
					{isLogin
						? "Don't have an account? Register here."
						: "Already have an account? Login here."}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
