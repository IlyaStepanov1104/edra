'use client';

import { ProtectedRoute } from '@/shared/ProtectedRoute';
import BotSettings from '@/features/BotSettings';

export default function BotSettingsPage() {
  return (
    <ProtectedRoute>
      <BotSettings />
    </ProtectedRoute>
  );
}