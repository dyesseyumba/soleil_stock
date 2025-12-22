import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const authRoutes = (app: FastifyInstance) => {
  // LOGIN
  app.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const refreshTokenRow = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenId: refreshTokenRow.id,
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });

    return reply.send({ accessToken });
  });

  // REFRESH
  app.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return reply.code(401).send({ message: 'Missing refresh token' });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);

      const stored = await prisma.refreshToken.findUnique({
        where: { id: payload.tokenId },
      });

      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        return reply.code(401).send({ message: 'Invalid refresh token' });
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        return reply.code(401).send({ message: 'User not found' });
      }

      const newAccessToken = signAccessToken({
        sub: user.id,
        email: user.email,
      });

      return reply.send({ accessToken: newAccessToken });
    } catch {
      return reply.code(401).send({ message: 'Invalid refresh token' });
    }
  });

  // LOGOUT
  app.post('/logout', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await prisma.refreshToken.update({
          where: { id: payload.tokenId },
          data: { revoked: true },
        });
      } catch (err) {
        console.error(err);
      }
    }

    reply.clearCookie('refreshToken', {
      path: '/api/auth/refresh',
    });

    return reply.code(204).send();
  });
};

export {authRoutes}
