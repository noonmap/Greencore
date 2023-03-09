import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useInput } from '@/core/hooks';
import { signUp } from '~/src/core/user/userAPI';

export default function signup() {
	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');
	const [nickname, onChangeNickname] = useInput('');

	async function handleSignUp(e: React.SyntheticEvent<EventTarget>) {
		e.preventDefault();
		try {
			const payload = { email, password, nickname };
			const { data } = await signUp(payload);
			console.log(data);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<AppLayout>
			<h1>회원가입</h1>

			<div className="space-y-2">
				<label>이메일</label>
				<input type="text" required className="block" onChange={onChangeEmail} />
				<label>비밀번호</label>
				<input type="text" required className="block" onChange={onChangePassword} />
				<label>닉네임</label>
				<input type="text" required className="block" onChange={onChangeNickname} />
			</div>

			<div>
				req data:
				<div>
					{email} {password} {nickname}
				</div>
			</div>

			<button className="bg-blue-500 rounded" onClick={handleSignUp}>
				회원가입
			</button>
		</AppLayout>
	);
}
