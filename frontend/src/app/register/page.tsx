'use client';

import { RegisterForm } from "@/features/Auth/RegisterForm";
import { View, Button, Text } from 'reshaped';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
      <View width="400px">
        <RegisterForm onSuccess={() => router.push('/')} />
        <View direction="row" justify="center" paddingTop={4}>
          <Text variant="body-2" color="neutral-faded">
            Already have account?{' '}
          </Text>
          <Button
            variant="ghost"
            size="small"
            onClick={() => router.push('/login')}
          >
            Log in
          </Button>
        </View>
      </View>
  );
}