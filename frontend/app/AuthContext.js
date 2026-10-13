"use client";

import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [JWTtoken, setJWTtoken] = useState("")

    return (
        <AuthContext.Provider value={[JWTtoken, setJWTtoken]}>
            {children}
        </AuthContext.Provider>
    )
}