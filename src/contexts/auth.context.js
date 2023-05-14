import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { login, getUser } from '../services/auth'
// import Loading from "../components/loading";

export const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    const signIn = async (username, password) => {
        const { access_token } = await login(username, password)

        setLoading(false)
        if (!access_token) return setUser(null)

        axios.defaults.headers.common.Authorization = `Bearer ${access_token}`
        setAccessToken(access_token)
        Cookies.set('access_token', access_token)
    }

    const signOut = async () => {
        Cookies.remove("access_token")
        setAccessToken(null)
        setUser(null)
        navigate("/login")
    }

    const getUserByAccessToken = async () => {
        const user = await getUser()

        if (!user) {
            navigate("/login")
            setLoading(false)
            return setUser(null)
        }
        navigate("/")
        setLoading(false)
        return setUser(user)
    }

    useEffect(() => {
        (async () => {
            const token = Cookies.get('access_token')
            if(token) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`
                setAccessToken(accessToken)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            await getUserByAccessToken()
            setLoading(false)
        })()
    }, [accessToken])

    if (loading) return <></>

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}