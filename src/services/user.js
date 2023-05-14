import axios from 'axios'
import { BASE_URL } from 'src/constants/server'

export async function getUserList() {
    try {
        const { data: users } = await axios.get(`${BASE_URL}/user/getList`)
        return users
    } catch (error) {
        return []
    }
}

export async function getDriverList() {
    try {
        const { data: drivers } = await axios.get(`${BASE_URL}/driver/getList`)
        return drivers
    } catch (error) {
        return []
    }
}

export async function createNewUser(user) {
    try {
        const { email, password, role, ...profileData } = user
        const { data: newUser } = await axios.post(`${BASE_URL}/auth/signUp`, {
            email,
            password,
            role
        })
        if(!newUser) throw new Error()

        const { data: profile } = await axios.post(`${BASE_URL}/user/createProfile/user/${newUser._id}`, {
            role,
            ...profileData
        })
        if(!profile) throw new Error()

        return profile
    } catch (error) {
        return null
    }
}

export async function updateUserProfile(id, user) {
    try {
        const { email, password, role, ...profileData } = user

        const { data: profile } = await axios.put(`${BASE_URL}/user/updateProfile/user/${id}`, {
            role,
            ...profileData
        })
        if(!profile) throw new Error()

        return profile
    } catch (error) {
        return null
    }
}

export async function deleteUser(id) {
    try {
        const { data: profile } = await axios.delete(`${BASE_URL}/user/deleteUser/${id}`)
        if(!profile) throw new Error()

        return profile
    } catch (error) {
        return null
    }
}