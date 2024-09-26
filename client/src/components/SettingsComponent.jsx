import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from "lucide-react";
import '../css/SettingsStyles.css';

const SettingsComponent = ({ onClose }) => {
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the current theme preference from localStorage or system preference
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="settings-container">
            <button className="close-button" onClick={onClose}>
                <X />
            </button>
            <h2>Settings</h2>
            <div className="setting-item">
                <label htmlFor="theme-toggle">Theme</label>
                <div className="toggle-switch">
                    <input
                        type="checkbox"
                        id="theme-toggle"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                    />
                    <span className="slider"></span>
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default SettingsComponent;
