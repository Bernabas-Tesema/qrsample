import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export function AdminLoginPage() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  if (user && isAdmin) {
    navigate('/', { replace: true });
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/images/sobana-logo.png"
            alt="Sobana Hotel"
            className="mx-auto h-20 w-20 rounded-full object-contain bg-white shadow-md"
          />
          <h1 className="mt-4 font-display text-2xl font-bold text-text-primary">
            Sobana Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to manage menu, categories, and restaurant settings
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 rounded-2xl border border-border bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="admin@sobanahotel.et"
                error={errors.email?.message}
                {...register('email', { required: 'Email is required' })}
              />
              <Mail className="absolute right-3 top-[38px] h-4 w-4 text-text-secondary" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <Lock className="absolute right-3 top-[38px] h-4 w-4 text-text-secondary" />
            </div>
          </div>

          <Button type="submit" loading={loading} className="mt-6 w-full" size="lg">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          This area is for authorized staff only.
        </p>
        <p className="mt-3 rounded-xl bg-gray-100 px-4 py-3 text-center text-xs text-text-secondary">
          Demo login: <strong>berni@gmail.com</strong> / <strong>12341234</strong>
        </p>
      </div>
    </div>
  );
}
