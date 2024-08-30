export interface ILoginMutation {
  phoneNumber: string;
  password: string;
}

export interface IOTPMutation {
  otpCode: string;
}

export interface INewPasswordMutation {
  newPassword: string;
  confirmPassword: string;
}

export interface IPhoneNumberRequest {
  phoneNumber: string;
}

export interface IPhoneNumberResponse {
  nikitaToken: string;
}

export interface IVerifyOTPRequest extends IOTPMutation {
  nikitaToken: string;
  phoneNumber: string;
}

export interface IVerifyOTPResponse {
  jwtAccessToken: string;
}

export interface IOTPChangePasswordRequest extends IVerifyOTPResponse {
  newPassword: string;
}
