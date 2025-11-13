
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';

interface AuthPageProps {
  isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLogin: initialIsLogin }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ name, email, password, phone, role });
      }
      navigate(role === Role.RIDER ? '/rider/dashboard' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h1>
          <p className="text-gray-600 mt-2">{isLogin ? 'Log in to continue.' : 'Join the Smart Porter community.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <Input label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required icon={<UserIcon size={16}/>} />
              <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required icon={<Phone size={16}/>} />
              <div className="flex gap-4">
                <label className={`flex-1 p-4 border rounded-2xl cursor-pointer transition-all ${role === Role.USER ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                  <input type="radio" name="role" value={Role.USER} checked={role === Role.USER} onChange={() => setRole(Role.USER)} className="hidden" />
                  <span className="font-semibold">I'm a Customer</span>
                  <p className="text-sm text-gray-500">I want to send packages.</p>
                </label>
                <label className={`flex-1 p-4 border rounded-2xl cursor-pointer transition-all ${role === Role.RIDER ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                  <input type="radio" name="role" value={Role.RIDER} checked={role === Role.RIDER} onChange={() => setRole(Role.RIDER)} className="hidden" />
                  <span className="font-semibold">I'm a Rider</span>
                  <p className="text-sm text-gray-500">I want to deliver.</p>
                </label>
              </div>
            </>
          )}
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required icon={<Mail size={16}/>} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required icon={<Lock size={16}/>} />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full" size="lg">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={toggleAuthMode} className="font-semibold text-primary hover:underline ml-1">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
