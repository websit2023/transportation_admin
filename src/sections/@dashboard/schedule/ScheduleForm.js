import { useEffect, useState } from "react";
import { Button, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { createNewSchedule, updateSchedule } from "src/services/schedule";
import { getRouteList } from "src/services/route";
import { getDriverList } from "src/services/user";
import { getVehicleList } from "src/services/vehicle";
import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers";

const ScheduleForm = ({ scheduleData, refresh }) => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("fill") // fill - error - success

    const [formData, setFormData] = useState({
        start_time: new Date(),
        end_time: new Date(),
        driver: '',
        route: '',
        vehicle: '',
        status: true
    });

    const [drivers, setDrivers] = useState([])
    const [routes, setRoutes] = useState([])
    const [vehicles, setVehicles] = useState([])

    useEffect(() => {
        (async () => {
            const driverList = await getDriverList()
            const routeList = await getRouteList()
            const vehicleList = await getVehicleList()

            setDrivers(driverList)
            setRoutes(routeList)
            setVehicles(vehicleList)
        })()
    }, [])

    useEffect(() => {
        if (scheduleData) {
            const { _id, __v, ...data } = scheduleData
            const driverId = data.driver._id
            const routeId = data.route._id
            const vehicleId = data.vehicle._id

            setFormData({
                ...data,
                route: routeId,
                driver: driverId,
                vehicle: vehicleId
            })
        }
    }, [scheduleData])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!scheduleData) {
            create(formData)

        } else {
            const filtered = { ...formData }
            for (let key in filtered) {
                if (typeof filtered[key] === 'string' && filtered[key].length === 0) {
                    delete filtered[key];
                }
            }

            update(filtered)
        }
    }

    const create = async (schedule) => {
        setLoading(true)
        const newSchedule = await createNewSchedule(schedule)
        if (newSchedule) {
            setStatus('success')
        } else {
            setStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    const update = async (schedule) => {
        setLoading(true)
        const updatedSchedule = await updateSchedule(scheduleData._id, schedule)
        if (updatedSchedule) {
            setStatus('success')
        } else {
            setStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    return (
        <>
            <Box component="form"
                sx={{
                    '& > :not(style)': { my: 1 },
                }}
                onSubmit={handleSubmit}
            >

                <DateTimePicker
                    value={dayjs(formData.start_time)}
                    label="Start time"
                    sx={{ width: '100%' }}
                    onChange={(value) => setFormData(prevS => ({ ...prevS, start_time: value["$d"] }))}
                />

                <DateTimePicker
                    label="End time"
                    value={dayjs(formData.end_time)}
                    sx={{ width: '100%' }}
                    onChange={(value) => setFormData(prevS => ({ ...prevS, end_time: value["$d"] }))}
                />

                <FormControl variant="outlined" fullWidth margin="normal" required={!scheduleData}>
                    <InputLabel id="driver-label">Driver</InputLabel>
                    <Select
                        labelId="driver-label"
                        value={formData.driver}
                        onChange={handleChange}
                        name="driver"
                        label="Driver"
                        required={!scheduleData}
                    >
                        {drivers.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.driver_name} - {option.code}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal" required={!scheduleData}>
                    <InputLabel id="route-label">Route</InputLabel>
                    <Select
                        labelId="route-label"
                        value={formData.route}
                        name="route"
                        onChange={handleChange}
                        label="Route"
                        required={!scheduleData}
                    >
                        {routes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.route_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal" required={!scheduleData}>
                    <InputLabel id="vehicle-label">Vehicle</InputLabel>
                    <Select
                        labelId="vehicle-label"
                        value={formData.vehicle}
                        name="vehicle"
                        onChange={handleChange}
                        label="Vehicle"
                        required={!scheduleData}
                    >
                        {vehicles.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.vehicle_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal" required={!scheduleData}>
                    <InputLabel id="status-label">Schedule status</InputLabel>
                    <Select
                        labelId="status-label"
                        value={formData.status}
                        name="status"
                        onChange={handleChange}
                        label="Schedule status"
                        required={!scheduleData}
                    >
                        <MenuItem value={true}> Running </MenuItem>
                        <MenuItem value={false}> Stopped </MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ mr: 1 }}>Submit</Button>
                    {loading ? <CircularProgress size={20} color="success" /> : null}
                </Box>
            </Box>

            {status === 'success' && <Alert severity="success">Success !</Alert>}
            {status === 'error' && <Alert severity="error">An error was occurred !</Alert>}
        </>
    );
};

export default ScheduleForm
