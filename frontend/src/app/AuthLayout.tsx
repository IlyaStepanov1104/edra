'use client';

import { ReactNode } from 'react';
import { View } from 'reshaped';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <View direction="column" height="100vh">
      <View paddingTop={8} paddingBottom={8} paddingStart={4} paddingEnd={4}>
        {children}
      </View>
    </View>
  );
}