import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Text,
  Anchor,
  Container,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { useForm } from '@mantine/form';
import ImageUpload from './ImageUpload';
import { useReducer, useState } from 'react';
import { validateSignUp } from '../validations/signup';
import { isAuth, signup, verifyOtp } from '../config/api';
import { toast } from 'react-hot-toast';

const initialValues = {
  name: '',
  email: '',
  credentials: '',
  confirmCredentials: '',
  isLoggedIn: false,
  otp: '',
};

export default function AuthenticationImage() {
  const [image, setImage] = useState('https://robohash.org/pizza-appa');
  const [isOtpSend, toggler] = useReducer((state) => !state, false);
  const largeScreen = useMediaQuery('(min-width:600px)');
  const [otpHash, setOtpHash] = useState('');
  const form = useForm({
    initialValues,
    validate: (values) => validateSignUp(values, isOtpSend),
  });
  const submitFormHandler = async (values: typeof initialValues) => {
    if (!isOtpSend) {
      try {
        const { data } = await toast.promise(
          signup({
            name: form.values.name,
            email: form.values.email,
            password: form.values.credentials,
            photo: image,
          }),
          {
            loading: 'Loading! Please wait....',
            success: <div>otp sended successfully</div>,
            error: <div>Please check the inputs !</div>,
          }
        );
        console.log(data);
        setOtpHash(data.hash);
        toggler();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    } else {
      try {
        await toast.promise(
          verifyOtp({
            email: form.values.email,
            hash: otpHash,
            otp: form.values.otp,
          }),
          {
            loading: 'Verifying otp.....',
            success: <div>Verified ! Signup successfully</div>,
            error: <div>Please enter valid otp</div>,
          }
        );
        const res = await isAuth();
        console.log(res.data, 'from isAuth');
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <Container size="xs" px="xs" pt={largeScreen ? 60 : 20}>
      <ImageUpload image={image} setImage={(url) => setImage(url)} />
      <form onSubmit={form.onSubmit((values) => submitFormHandler(values))}>
        <TextInput
          label="Name"
          placeholder="John Doe"
          size="md"
          withAsterisk
          {...form.getInputProps('name')}
          disabled={isOtpSend}
        />
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          {...form.getInputProps('email')}
          size="md"
          mt="md"
          withAsterisk
          disabled={isOtpSend}
        />
        {!isOtpSend && (
          <>
            <PasswordInput
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('credentials')}
              mt="md"
              size="md"
              withAsterisk
              disabled={isOtpSend}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Your confirm password"
              mt="md"
              size="md"
              {...form.getInputProps('confirmCredentials')}
              withAsterisk
              disabled={isOtpSend}
            />
          </>
        )}
        {isOtpSend && (
          <PasswordInput
            label="Enter otp"
            placeholder="Your unique otp"
            mt="md"
            description="Enter the 6 digit otp that has been sended to the provided email id!"
            size="md"
            {...form.getInputProps('otp')}
            withAsterisk
          />
        )}
        <Checkbox
          label="Keep me logged in"
          mt="xl"
          size="md"
          {...form.getInputProps('isLoggedIn')}
        />
        <Button fullWidth mt="xl" size="md" type="submit">
          {isOtpSend ? 'Sign Up' : 'Send Otp'}
        </Button>
      </form>
      <Text ta="center" mt="md">
        Don&apos;t have an account?{' '}
        <Link to={'/signin'}>
          <Anchor component="button" weight={700}>
            Login
          </Anchor>
        </Link>
      </Text>
    </Container>
  );
}
