import React from 'react';
import SettingsLayout from '@/layout/SettingsLayout';
import { useAppSelector } from '@/core/hooks';
import UserSettingsConfirm from '@/components/UserSettingsConfirm';
import UserSettingsPassword from '@/components/UserSettingsPassword';

export default function password() {
	const authType = useAppSelector((state) => state.common.authType);
	const isPossibleUpdateUser = useAppSelector((state) => state.user.isPossibleUpdateUser);

	if (authType != 'DB') {
		return (
			<SettingsLayout>
				<UserSettingsPassword />
			</SettingsLayout>
		);
	}

	return <SettingsLayout>{isPossibleUpdateUser ? <UserSettingsPassword /> : <UserSettingsConfirm />}</SettingsLayout>;
}
