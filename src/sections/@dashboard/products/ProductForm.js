import { Alert, Box, Button, Card, CardMedia, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { createNewVehicle, deleteVehicle, updateVehicle } from "src/services/vehicle";

const statusOptions = [
    {
        value: "available",
        label: "Available",
    },
    {
        value: "unavailable",
        label: "Unavailable",
    },
];

function ProductForm({ vehicle, refresh }) {
    const [vehicleName, setVehicleName] = useState("");
    const [image, setImage] = useState("");
    const [seats, setSeats] = useState(0);
    const [status, setStatus] = useState("available");
    const [year, setYear] = useState(0);

    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("fill") // fill - error - success

    useEffect(() => {
        if(vehicle) {
            setVehicleName(vehicle.vehicle_name)
            setImage(vehicle.image)
            setStatus(vehicle.status)
            setSeats(vehicle.seats)
            setYear(vehicle.year)
        }
    }, [vehicle])

    const create = async (data) => {
        setLoading(true)
        const newVehicle = await createNewVehicle(data)
        if (newVehicle) {
            setSubmitStatus('success')
        } else {
            setSubmitStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    const update = async (data) => {
        setLoading(true)
        const updatedVehicle = await updateVehicle(vehicle._id, data)
        if (updatedVehicle) {
            setSubmitStatus('success')
        } else {
            setSubmitStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const vehicleData = {
            vehicle_name: vehicleName,
            image,
            seats,
            status,
            year
        }

        if (!vehicle) {
            create(vehicleData)

        } else {
            for (let key in vehicleData) {
                if (typeof vehicleData[key] === 'string' && vehicleData[key].length === 0) {
                    delete vehicleData[key];
                }
            }

            update(vehicleData)
        }
    };

    const deleteProduct = async () => {
        setLoading(true)
        const deletedVehicle = await deleteVehicle(vehicle._id)
        if (deletedVehicle) {
            setSubmitStatus('success')
        } else {
            setSubmitStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1 },
            }}
            onSubmit={handleSubmit}
        >
            <Grid container spacing={2}>
                <Grid item lg={7}>
                    <TextField
                        label="Vehicle Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        required={!vehicle}
                    />
                    <TextField
                        label="Image URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required={!vehicle}
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                            label="Number of Seats"
                            variant="outlined"
                            style={{ flex: 1, marginRight: "10px", width: "50%" }}
                            margin="normal"
                            type="number"
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            required={!vehicle}
                        />
                        <FormControl variant="outlined" style={{ flex: 1, marginLeft: "10px", width: "50%" }} margin="normal">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Status"
                                required={!vehicle}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        label="Year"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        required={!vehicle}
                    />
                </Grid>
                <Grid item lg={5}>
                    {image && !imageError ? (
                        <Card>
                            <CardMedia component="img" src={image} onError={() => setImageError(true)} />
                        </Card>
                    ) : null}
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ mr: 1 }}>Submit</Button>
                {vehicle 
                    ? <Button 
                        variant="contained" 
                        color="error" 
                        type="button" 
                        disabled={loading} 
                        sx={{ mr: 1 }}
                        onClick={deleteProduct}
                    >   Delete
                    </Button> 
                    : null
                }
                {loading ? <CircularProgress size={20} color="success" /> : null}
            </Box>
            {submitStatus === 'success' && <Alert severity="success">Success !</Alert>}
            {submitStatus === 'error' && <Alert severity="error">An error was occurred !</Alert>}
        </Box>
    );
}

export default ProductForm;