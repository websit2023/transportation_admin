import { useEffect, useState } from "react";
import { TextField, Button, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { createNewRoute, updateRoute } from "src/services/route";

export const provinces = [
    {
        "provinceId": 1,
        "name": "An Giang"
    },
    {
        "provinceId": 2,
        "name": "Bà Rịa – Vũng Tàu"
    },
    {
        "provinceId": 3,
        "name": "Bạc Liêu"
    },
    {
        "provinceId": 4,
        "name": "Bắc Giang"
    },
    {
        "provinceId": 5,
        "name": "Bắc Kạn"
    },
    {
        "provinceId": 6,
        "name": "Bắc Ninh"
    },
    {
        "provinceId": 7,
        "name": "Bến Tre"
    },
    {
        "provinceId": 8,
        "name": "Bình Dương"
    },
    {
        "provinceId": 9,
        "name": "Bình Định"
    },
    {
        "provinceId": 10,
        "name": "Bình Phước"
    },
    {
        "provinceId": 11,
        "name": "Bình Thuận"
    },
    {
        "provinceId": 12,
        "name": "Cà Mau"
    },
    {
        "provinceId": 13,
        "name": "Cao Bằng"
    },
    {
        "provinceId": 14,
        "name": "Cần Thơ"
    },
    {
        "provinceId": 15,
        "name": "Đà Nẵng"
    },
    {
        "provinceId": 16,
        "name": "Đắk Lắk"
    },
    {
        "provinceId": 17,
        "name": "Đắk Nông"
    },
    {
        "provinceId": 18,
        "name": "Điện Biên"
    },
    {
        "provinceId": 19,
        "name": "Đồng Nai"
    },
    {
        "provinceId": 20,
        "name": "Đồng Tháp"
    },
    {
        "provinceId": 21,
        "name": "Gia Lai"
    },
    {
        "provinceId": 22,
        "name": "Hà Giang"
    },
    {
        "provinceId": 23,
        "name": "Hà Nam"
    },
    {
        "provinceId": 24,
        "name": "Hà Nội"
    },
    {
        "provinceId": 25,
        "name": "Hà Tĩnh"
    },
    {
        "provinceId": 26,
        "name": "Hải Dương"
    },
    {
        "provinceId": 27,
        "name": "Hải Phòng"
    },
    {
        "provinceId": 28,
        "name": "Hậu Giang"
    },
    {
        "provinceId": 29,
        "name": "Hòa Bình"
    },
    {
        "provinceId": 30,
        "name": "Thành phố Hồ Chí Minh"
    },
    {
        "provinceId": 31,
        "name": "Hưng Yên"
    },
    {
        "provinceId": 32,
        "name": "Khánh Hòa"
    },
    {
        "provinceId": 33,
        "name": "Kiên Giang"
    },
    {
        "provinceId": 34,
        "name": "Kon Tum"
    },
    {
        "provinceId": 35,
        "name": "Lai Châu"
    },
    {
        "provinceId": 36,
        "name": "Lạng Sơn"
    },
    {
        "provinceId": 37,
        "name": "Lào Cai"
    },
    {
        "provinceId": 38,
        "name": "Lâm Đồng"
    },
    {
        "provinceId": 39,
        "name": "Long An"
    },
    {
        "provinceId": 40,
        "name": "Nam Định"
    },
    {
        "provinceId": 41,
        "name": "Nghệ An"
    },
    {
        "provinceId": 42,
        "name": "Ninh Bình"
    },
    {
        "provinceId": 43,
        "name": "Ninh Thuận"
    },
    {
        "provinceId": 44,
        "name": "Phú Thọ"
    },
    {
        "provinceId": 45,
        "name": "Phú Yên"
    },
    {
        "provinceId": 46,
        "name": "Quảng Bình"
    },
    {
        "provinceId": 47,
        "name": "Quảng Nam"
    },
    {
        "provinceId": 48,
        "name": "Quảng Ngãi"
    },
    {
        "provinceId": 49,
        "name": "Quảng Ninh"
    },
    {
        "provinceId": 50,
        "name": "Quảng Trị"
    },
    {
        "provinceId": 51,
        "name": "Sóc Trăng"
    },
    {
        "provinceId": 52,
        "name": "Sơn La"
    },
    {
        "provinceId": 53,
        "name": "Tây Ninh"
    },
    {
        "provinceId": 54,
        "name": "Thái Bình"
    },
    {
        "provinceId": 55,
        "name": "Thái Nguyên"
    },
    {
        "provinceId": 56,
        "name": "Thanh Hóa"
    },
    {
        "provinceId": 57,
        "name": "Thừa Thiên Huế"
    },
    {
        "provinceId": 58,
        "name": "Tiền Giang"
    },
    {
        "provinceId": 59,
        "name": "Trà Vinh"
    },
    {
        "provinceId": 60,
        "name": "Tuyên Quang"
    },
    {
        "provinceId": 61,
        "name": "Vĩnh Long"
    },
    {
        "provinceId": 62,
        "name": "Vĩnh Phúc"
    },
    {
        "provinceId": 63,
        "name": "Yên Bái"
    }
]

export const Form = ({ routeData, refresh }) => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("fill") // fill - error - success

    const [formData, setFormData] = useState({
        route_name: "",
        start_point: "",
        end_point: "",
        customer_name: "",
        distance: "",
        fare: ""
    });


    useEffect(() => {
        if (routeData) {
            const { _id, __v, ...data } = routeData
            setFormData(data)
        }
    }, [routeData])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!routeData) {
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

    const create = async (route) => {
        setLoading(true)
        const newRoute = await createNewRoute(route)
        if (newRoute) {
            setStatus('success')
        } else {
            setStatus('error')
        }
        await refresh()
        setLoading(false)
    }

    const update = async (route) => {
        setLoading(true)
        const updatedRoute = await updateRoute(routeData._id, route)
        if (updatedRoute) {
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
                <TextField
                    name="route_name"
                    label="Route name"
                    value={formData.route_name}
                    fullWidth
                    onChange={handleChange}
                    required={!routeData}
                />

                <FormControl variant="outlined" fullWidth margin="normal" required={!routeData}>
                    <InputLabel id="start_point">Start point</InputLabel>
                    <Select
                        labelId="start_point"
                        value={formData.start_point}
                        onChange={handleChange}
                        name="start_point"
                        label="Start point"
                        required={!routeData}
                    >
                        {provinces.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth margin="normal" required={!routeData}>
                    <InputLabel id="end_point">End point</InputLabel>
                    <Select
                        labelId="end_point"
                        value={formData.end_point}
                        onChange={handleChange}
                        name="end_point"
                        label="End point"
                        required={!routeData}
                    >
                        {provinces.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    required={!routeData}
                    name="distance"
                    type="number"
                    label="Distance (KM)"
                    value={formData.distance}
                    onChange={handleChange}
                />
                <TextField
                    label="Fare (USD)"
                    required={!routeData}
                    name="fare"
                    type="number"
                    value={formData.fare}
                    onChange={handleChange}
                    fullWidth
                />
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
