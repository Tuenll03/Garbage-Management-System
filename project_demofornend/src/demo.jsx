import React, { useState } from 'react';
import axios from 'axios';


function demo() {
    const [citizenId, setCitizenId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            citizenId: cleanCitizenId,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:8081/api/members', data);
            setMessage(response.data)

        } catch (error) {

        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Citizen ID:</label>
                <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">demo</button>
            </form>
        </>
    );
}

export default demo;
