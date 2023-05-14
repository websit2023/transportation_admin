import axios from 'axios'
import { BASE_URL } from 'src/constants/server'

export async function getVehicleList() {
    try {
        const { data: vehicles } = await axios.get(`${BASE_URL}/vehicle/getList`)
        return vehicles
    } catch (error) {
        return []
    }
}

export async function createNewVehicle(vehicleData) {
    try {
        const { data: vehicle } = await axios.post(`${BASE_URL}/vehicle/create`, vehicleData)
        if(!vehicle) throw new Error()

        return vehicle
    } catch (error) {
        return null
    }
}

export async function updateVehicle(id, vehicleData) {
    try {
        const { data: vehicle } = await axios.put(`${BASE_URL}/vehicle/update/${id}`, vehicleData)
        if(!vehicle) throw new Error()

        return vehicle
    } catch (error) {
        return null
    }
}

export async function deleteVehicle(id) {
    try {
        const { data: profile } = await axios.delete(`http://localhost:9000/vehicle/delete/${id}`)
        if(!profile) throw new Error()

        return profile
    } catch (error) {
        return null
    }
}