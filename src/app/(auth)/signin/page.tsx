"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="border p-6 flex flex-col gap-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border p-2 text-black" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded-lg border p-2 text-black" />
                <button onClick={() => signIn("credentials", { email, password })} className="bg-white text-black rounded-lg px-4 py-2">Sign In</button>
                <button onClick={() => signOut()} className="bg-white text-black rounded-lg px-4 py-2">Sign Out</button>
            </div>
        </div>
    )
}