import { FC, useState } from 'react';
import { Button, Text, TextField, View } from 'reshaped';
import { login } from '@shared/lib/api';
import { useAuth } from '@shared/lib/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { statusCode, access_token } = await login({ email, password });
      if (!access_token && statusCode !== '200') {
        setError('Invalid email or password');
        return;
      }
      setToken(access_token);
      onSuccess?.();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <View gap={4}>
      <TextField
        name="email"
        value={email}
        onChange={({ value }) => setEmail(value)}
        placeholder="Email"
      />
      <TextField
        name="password"
        value={password}
        onChange={({ value }) => setPassword(value)}
        placeholder="Password"
        inputAttributes={{ type: 'password' }}
      />
      {error && <Text color="critical">{error}</Text>}
      <Button type="submit" fullWidth loading={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      </View>
    </form>
  );
};