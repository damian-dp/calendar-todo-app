import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
	const [verificationStatus, setVerificationStatus] = useState('Verifying...');
	const { token } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await fetch(`/api/users/verify/${token}`, {
					method: 'GET',
				});
				const data = await response.json();
				if (response.ok) {
					setVerificationStatus('Email verified successfully. Redirecting to login...');
					localStorage.setItem('token', data.token);
					setTimeout(() => navigate('/calendar'), 3000);
				} else {
					setVerificationStatus(data.message || 'Verification failed');
				}
			} catch (error) {
				console.error('Error:', error);
				setVerificationStatus('An error occurred during verification');
			}
		};

		verifyEmail();
	}, [token, navigate]);

	return (
		<div className="verification-container">
			<h2>Email Verification</h2>
			<p>{verificationStatus}</p>
		</div>
	);
};

export default EmailVerification;