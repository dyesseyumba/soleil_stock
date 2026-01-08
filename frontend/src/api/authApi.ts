import type { LoginInput } from '@/schemas';
import { axiosClient } from './axiosClient';

// type LoginInput = {
//   email: string;
//   password: string;
// };

type LoginResponse = {
  accessToken: string;
};

async function login(payload: LoginInput): Promise<LoginResponse> {
  const { data } = await axiosClient.post<LoginResponse>(
    '/auth/login',
    payload,
    { withCredentials: true }, // important for refresh token cookie
  );

  return data;
}

async function logout(): Promise<void> {
  await axiosClient.post('/auth/logout');
}

export { login, logout };

export type {  LoginResponse };
