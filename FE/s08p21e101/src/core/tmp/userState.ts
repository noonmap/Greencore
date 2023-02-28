// state
type ResData = {
	id: number;
	name: string;
	username: string;
	email: string;
};

interface UserState {
	isLoggingIn: boolean; // 로그인중
	isLoggedIn: boolean; // 로그인 후
	logInError: boolean;
	data: ResData;
}

const initialState: UserState = {
	isLoggingIn: false,
	isLoggedIn: false,
	logInError: false,

	data: {
		id: 0,
		name: "[사용자이름]",
		username: "[사용자닉네임]",
		email: "[사용자이메일]"
	}
};

export default initialState;
