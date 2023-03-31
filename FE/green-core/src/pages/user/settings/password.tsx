import React from 'react';
import SettingsLayout from '@/layout/SettingsLayout';
import { useAppSelector } from '@/core/hooks';
import UserSettingsConfirm from '@/components/UserSettingsConfirm';
import UserSettingsPassword from '@/components/UserSettingsPassword';

export default function password() {
  const isPossibleUpdateUser = useAppSelector((state) => state.user.isPossibleUpdateUser);

  return <SettingsLayout>{isPossibleUpdateUser ? <UserSettingsPassword /> : <UserSettingsConfirm />}</SettingsLayout>;
}
