"use client";

import { SessionProvider } from "next-auth/react";
import { Children } from "react";

const AuthProvider = ({ Children }) => {
    return <SessionProvider>{Children}</SessionProvider>
};

export default AuthProvider