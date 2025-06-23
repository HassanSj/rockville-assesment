'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/login', data);
      localStorage.setItem('token', res.data.token);
      Cookies.set('token', res.data.token);
      login(res.data.token);
      router.push('/dashboard');
      toast.success('Logged In');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('email')} placeholder="Email" className="w-full border px-4 py-2 rounded text-black" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input type="password" {...register('password')} placeholder="Password" className="w-full border px-4 py-2 rounded text-black" />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <button type="submit" className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition">
          Login
        </button>

        <p className="text-center text-sm text-black">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </Card>
  );
}
