import React from 'react';
import SettingsLayout from '@/layout/SettingsLayout';
import { useAppSelector } from '@/core/hooks';
import UserSettingsConfirm from '@/components/UserSettingsConfirm';
import UserSettingsDeleteUser from '@/components/UserSettingsDeleteUser';

export default function deleteUser() {
	const authType = useAppSelector((state) => state.common.authType);
	const isPossibleUpdateUser = useAppSelector((state) => state.user.isPossibleUpdateUser);

	if (authType != 'DB') {
		return (
			<SettingsLayout>
				<UserSettingsDeleteUser />
			</SettingsLayout>
		);
	}

	return <SettingsLayout>{isPossibleUpdateUser ? <UserSettingsDeleteUser /> : <UserSettingsConfirm />}</SettingsLayout>;
}
