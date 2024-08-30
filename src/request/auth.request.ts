import http from '@/lib/http';
import { ForgotPasswordBodyType, LoginBodyType } from '@/schema-validations/auth.schema';
import { ChangePasswordBodyType } from '@/schema-validations/influencer-account.schema';
import { EVerifyAction } from '@/types/enum';

const authRequest = {
  login: (body: LoginBodyType) => http.post('/Auth/login', body),
  refreshToken: (token: string) => http.post('/Auth/refreshToken', { token }),
  changePassword: (body: ChangePasswordBodyType) => http.put('/Auth/changePass', body),
  forgotPassword: (body: ForgotPasswordBodyType) => http.put('/Auth/forgotPass', body),
  logout: (refreshToken: string) => http.post('/Auth/logout', { token: refreshToken }),
  verify: (action: EVerifyAction, token: string) => http.get(`/Auth/verify?action=${action}&token=${token}`),
};

export default authRequest;
