"use client";

import { LoginForm } from "@/features/Auth/LoginForm";
import { View, Button, Text } from "reshaped";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <View width="400px">
      <LoginForm onSuccess={() => router.push("/")} />
      <View direction="row" justify="center" paddingTop={4}>
        <Text variant="body-2" color="neutral-faded">
          Нет аккаунта?{" "}
        </Text>
        <Button
          variant="ghost"
          size="small"
          onClick={() => router.push("/register")}
        >
          Зарегистрироваться
        </Button>
      </View>
    </View>
  );
}
