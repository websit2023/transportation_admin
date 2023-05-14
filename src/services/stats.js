import axios from 'axios'
import { BASE_URL } from 'src/constants/server'

export async function getStatsByYear() {
    try {
        const { data: stats } = await axios.get(`${BASE_URL}/stats/year`)
        if(!stats) throw new Error()

        return stats
    } catch (error) {
        return null
    }
}

export async function getStatsByMonth() {
    try {
        const { data: stats } = await axios.get(`${BASE_URL}/stats/month`)
        if(!stats) throw new Error()

        return stats
    } catch (error) {
        return null
    }
}

export async function getDashboardStats() {
    try {
        const { data: stats } = await axios.get(`${BASE_URL}/stats/all`)
        if(!stats) throw new Error()

        return stats
    } catch (error) {
        return null
    }
}