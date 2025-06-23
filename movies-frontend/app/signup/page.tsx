'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/signup', data);
      localStorage.setItem('token', res.data.token);
      Cookies.set('token', res.data.token);
      signup(res.data.token);
      router.push('/dashboard');
      toast.success('Successfully signed up');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Card title="Sign Up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full border px-4 py-2 rounded text-black" />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>

        <input {...register('email')} placeholder="Email" className="w-full border px-4 py-2 rounded text-black" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input type="password" {...register('password')} placeholder="Password" className="w-full border px-4 py-2 rounded text-black" />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <button type="submit" className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition">
          Sign Up
        </button>
      </form>
    </Card>
  );
}
