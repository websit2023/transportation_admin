import axios from 'axios'
import { BASE_URL } from 'src/constants/server'

export async function getRouteList() {
    try {
        const { data: routes } = await axios.get(`${BASE_URL}/route/getList`)
        return routes
    } catch (error) {
        return []
    }
}

export async function createNewRoute(routeData) {
    try {
        const { data: route } = await axios.post(`${BASE_URL}/route/create`, routeData)
        if(!route) throw new Error()

        return route
    } catch (error) {
        return null
    }
}

export async function updateRoute(id, routeData) {
    try {
        const { data: route } = await axios.put(`${BASE_URL}/route/update/${id}`, routeData)
        if(!route) throw new Error()

        return route
    } catch (error) {
        return null
    }
}

export async function deleteRoute(id) {
    try {
        const { data: profile } = await axios.delete(`http://localhost:9000/route/delete/${id}`)
        if(!profile) throw new Error()

        return profile
    } catch (error) {
        return null
    }
}