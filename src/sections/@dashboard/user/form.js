import { useCallback, useEffect, useState } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, CircularProgress, Alert } from "@mui/material";
import { createNewUser, updateUserProfile } from "src/services/user";

const roles = ["driver", "customer"];

const DriverForm = ({ user, createUser, updateUser, loading }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "driver",
        driver_name: "",
        phone_number: "",
        address: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!user) {
            createUser(formData)
        } else {
            const filtered = { ...formData }
            for (let key in filtered) {
                if (typeof filtered[key] === 'string' && filtered[key].length === 0) {
                    delete filtered[key];
                }
            }

            updateUser(filtered)
        }
    }

    useEffect(() => {
        if (user) {
            const { email, password, driver } = user
            const { _id, created_at, __v, code, ...driverData } = driver
            setFormData({
                email,
                password: '',
                ...driverData
            })
        }
    }, [user])

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1 },
            }}
            onSubmit={handleSubmit}
        >
            <TextField
                name="email"
                required={!user}
                fullWidth
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={user !== null}
            />
            <TextField
                name="password"
                required={!user}
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
            />

            <TextField
                name="driver_name"
                required={!user}
                fullWidth
                label="Driver Name"
                value={formData.driver_name}
                onChange={handleChange}
            />
            <TextField
                name="phone_number"
                required={!user}
                fullWidth
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
            />
            <TextField
                name="address"
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleChange}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ mr: 1 }}>Submit</Button>
                {loading ? <CircularProgress size={20} color="success" /> : null}
            </Box>
        </Box >
    );
};

const CustomerForm = ({ user, createUser, updateUser, loading }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "customer",
        customer_name: "",
        phone_number: "",
        year_of_birth: "",
        address: "",
    });


    useEffect(() => {
        if (user) {
            const { email, password, customer } = user
            const { _id, ...customerData } = customer
            setFormData({
                email,
                password: '',
                ...customerData
            })
        }
    }, [user])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!user) {
            createUser(formData)

        } else {
            const filtered = { ...formData }
            for (let key in filtered) {
                if (typeof filtered[key] === 'string' && filtered[key].length === 0) {
                    delete filtered[key];
                }
            }

            updateUser(filtered)
        }
    }


    return (
        <Box component="form"
            sx={{
                '& > :not(style)': { my: 1 },
            }}
            onSubmit={handleSubmit}
        >
            <TextField
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                fullWidth
                onChange={handleChange}
                required={!user}
                disabled={user !== null}
            />
            <TextField
                fullWidth
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required={!user}
            />

            <TextField
                fullWidth
                name="customer_name"
                label="Customer Name"
                required={!user}
                value={formData.customer_name}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                required={!user}
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
            />
            <TextField
                label="Year of Birth"
                name="year_of_birth"
                type="number"
                value={formData.year_of_birth}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                name="address"
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleChange}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ mr: 1 }}>Submit</Button>
                {loading ? <CircularProgress size={20} color="success" /> : null}
            </Box>
        </Box>
    );
};

export const Form = ({ userData, refresh }) => {
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("fill") // fill - error - success

    useEffect(() => {
        if (userData) {
            setSelectedRole(userData.role)
        }
    }, [userData])

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const createUser = useCallback(async (user) => {
        setLoading(true)
        const newUser = await createNewUser(user)
        if (newUser) {
            setStatus('success')
        } else {
            setStatus('error')
        }
        await refresh()
        setLoading(false)
    }, [])

    const updateUser = useCallback(async (user) => {
        setLoading(true)
        const updatedUser = await updateUserProfile(userData._id, {
            role: selectedRole,
            ...user
        })
        if (updatedUser) {
            setStatus('success')
        } else {
            setStatus('error')
        }
        await refresh()
        setLoading(false)
    }, [selectedRole])

    return (
        <>
            <FormControl sx={{ my: 1 }} fullWidth>
                <InputLabel id="role-select-label">Select Role</InputLabel>
                <Select
                    labelId="role-select-label"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    disabled={userData !== null}
                    fullWidth
                >
                    {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedRole === "driver" && <DriverForm user={userData} createUser={createUser} loading={loading} updateUser={updateUser} />}
            {selectedRole === "customer" && <CustomerForm user={userData} createUser={createUser} loading={loading} updateUser={updateUser} />}
            {status === 'success' && <Alert severity="success">Success !</Alert>}
            {status === 'error' && <Alert severity="error">An error was occurred !</Alert>}
        </>
    );
};
