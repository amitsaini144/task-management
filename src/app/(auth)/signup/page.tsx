"use client";


import axios from "axios";
import { useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        try {

            const response = await axios.post("/api/signup", {
                username,
                email,
                password
            });
            console.log(response);

            if (response.status === 200) {
                alert("Sign Up Successful");
                window.location.href = "/";
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="border p-6 flex flex-col gap-4">
                <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="rounded-lg border p-2 text-black" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border p-2 text-black" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded-lg border p-2 text-black" />
                <button onClick={handleSignUp} className="bg-white text-black rounded-lg px-4 py-2">Sign Up</button>
            </div>
        </div>
    )
}