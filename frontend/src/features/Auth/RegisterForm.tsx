'use client';

import { FC, useState } from 'react';
import { Button, Text, TextField, View } from 'reshaped';
import { register as apiRegister } from '@/shared/lib/api';
import { useAuth } from '@/shared/lib/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { access_token } = await apiRegister({ email, password, name });
      setToken(access_token);
      onSuccess?.();
    } catch (err) {
      setError('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View gap={4}>
      <TextField
        name="name"
        value={name}
        onChange={({ value }) => setName(value)}
        placeholder="Имя"
        inputAttributes={{ required: true }}
      />
      <TextField
        name="email"
        value={email}
        onChange={({ value }) => setEmail(value)}
        placeholder="Email"
        inputAttributes={{ required: true }}
      />
      <TextField
        name="password"
        value={password}
        onChange={({ value }) => setPassword(value)}
        placeholder="Пароль"
        inputAttributes={{ 
          required: true,
          type: 'password'
        }}
      />
      {error && <Text color="critical">{error}</Text>}
      <Button onClick={handleSubmit} disabled={isLoading} fullWidth>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </View>
  );
};