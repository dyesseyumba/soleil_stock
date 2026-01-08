import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  sub: string;
  email?: string;
  name?: string;
};

function getUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export { getUserFromToken };
