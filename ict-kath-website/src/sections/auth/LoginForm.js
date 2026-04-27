import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
// icons
import viewIcon from '@iconify/icons-carbon/view';
import viewOff from '@iconify/icons-carbon/view-off';
// next
import NextLink from 'next/link';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Link, TextField, IconButton, InputAdornment } from '@mui/material';
// routes
import Routes from '../../routes';
// components
import { Iconify } from '../../components';
import { HOST_API } from '../../config';
import axios from 'axios';
// ----------------------------------------------------------------------

const FormSchema = Yup.object().shape({
  phone: Yup.string().required('Phone number is required').min(10, 'Phone should be of minimum 10 characters length'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    axios
      .post(`https://prod-api-v2.ictkathurusingha.com/api/user/login`, data)
      .then((response) => {
        console.log(response.data);
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.user &&
          response.data.data.user.token
        )
          window.location.replace(
            `https://student.ictkathurusingha.com/auth/login?redirect=${btoa(
              JSON.stringify(response.data.data.user)
            )}`
          );
        else window.location.replace('https://student.ictkathurusingha.com/auth/registration');
      })
      .catch((error) => {
        window.location.replace('https://student.ictkathurusingha.com/auth/registration');
      });
    // reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5} alignItems="flex-end">
        <Controller
          name="phone"
          control={control}
          translate="no"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Phone number (Eg: 07xxxxxxxx)"
              required
              translate="no"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          translate="no"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              translate="no"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? viewIcon : viewOff} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <NextLink href={`${HOST_API.studentAppBaseURL}auth/forgot-password`} passHref>
          <Link variant="body3" underline="always" color="text.secondary">
            Forgot password?
          </Link>
        </NextLink>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login or Register Now for Free
        </LoadingButton>
      </Stack>
    </form>
  );
}
