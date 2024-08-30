import { UploadFile } from 'antd';

export interface IUserFromDb {
  _id: string;
  username: string;
  phoneNumber: string;
  role: 'admin' | 'moderator' | 'owner';
  image: string | null;
  blocked: boolean;
}

export interface IRegisterResponse {
  user: IUserFromDb;
  accessToken: string;
}

export interface INewUserMutation {
  username: string;
  phoneNumber: string;
  image: {
    fileList: UploadFile[];
  };
}

export interface INewUser {
  username: string;
  phoneNumber: string;
  image: File | undefined;
}

export interface IEditUserMutation {
  username: string;
  image: File | null;
}

export interface IEditRequest {
  edit: IEditUserMutation;
  id: string;
}

export interface INewPassword {
  currentPassword: string;
  newPassword: string;
}
