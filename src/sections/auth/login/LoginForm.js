import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useAuth } from 'src/contexts/auth.context';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [account, setAccount] = useState({
    email: '',
    password: ''
  })
  
  const { signIn } = useAuth()

  const [showPassword, setShowPassword] = useState(false);

  const handleClick =  async() => {
    signIn(account.email, account.password)
  };

  const handleFieldChange = (e) => {
    const { value, name } = e.target
    setAccount(s => ({
      ...s,
      [name]: value
    }))
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" type='email' label="Email address" onChange={handleFieldChange} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={handleFieldChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
