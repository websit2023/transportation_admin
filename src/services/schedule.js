import axios from 'axios'

export async function getScheduleList() {
    try {
        const { data: schedules } = await axios.get(`${BASE_URL}/schedule/getList`)
        return schedules
    } catch (error) {
        return []
    }
}

export async function createNewSchedule(scheduleData) {
    try {
        const { data: schedule } = await axios.post(`${BASE_URL}/schedule/create`, scheduleData)
        if(!schedule) throw new Error()

        return schedule
    } catch (error) {
        return null
    }
}

export async function updateSchedule(id, scheduleData) {
    try {
        const { data: schedule } = await axios.put(`${BASE_URL}/schedule/update/${id}`, scheduleData)
        if(!schedule) throw new Error()

        return schedule
    } catch (error) {
        return null
    }
}

export async function deleteSchedule(id) {
    try {
        const { data: schedule } = await axios.delete(`http://localhost:9000/schedule/delete/${id}`)
        if(!schedule) throw new Error()

        return schedule
    } catch (error) {
        return null
    }
}