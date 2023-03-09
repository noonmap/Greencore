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
  plantId?: number;
  plantNickname: string;
};
