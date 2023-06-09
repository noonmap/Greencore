export type UserType = {};

export type SignUpDataType = {
  email: string;
  nickname: string;
  password: string;
};

export type LogInDataType = {
  email: string;
  password: string;
};

export type LogInOAuthDataType = {
  accessToken: string;
  refreshToken: string;
  nickname?: string;
};

export type EmailType = {
  email?: string;
  authCode?: string;
};

export type PasswordType = {
  password?: string;
  newPassword?: string;
};

export type ProfileType = {
  nickname?: string;
  introduction?: string;
  profileImage?: FormData;
};

export type UserPlantType = {
  userPlantId?: number;
  plantNickname: string;
};

export type SearchUserType = {
  nickname: string;
  profileImagePath: string;
};
