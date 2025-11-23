import { Router } from 'express';
import dotenv from 'dotenv';
import { verifyGoogleIdToken, exchangeAppleCode } from '../services/oauth';
import { prisma as prismaClient } from '../config/prisma'
import jwt from 'jsonwebtoken';

dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function findOrCreateUserFromSocial(provider: string, providerId: string, email?: string, name?: string) {
  // try find social account
  const existing = await prismaClient.socialAccount.findUnique({ where: { provider_providerId: { provider, providerId } }, include: { usuario: true } });
  if (existing) return existing.usuario;

  // if not, try find user by email
  let user = null;
  if (email) {
    user = await prismaClient.usuario.findUnique({ where: { email } });
  }

  if (!user) {
    // create a minimal user record
    user = await prismaClient.usuario.create({ data: { nome: name || 'Usuário', email: email || `no-email-${provider}-${providerId}@local`, senha: '', telefone: '' } });
  }

  // create social account
  await prismaClient.socialAccount.create({ data: { provider, providerId, email, userId: user.id } });
  return user;
}

// For SPA/mobile: accept id_token from client (Google) and return project JWT
router.post('/google/token', async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ erro: 'id_token necessário' });

    const payload = await verifyGoogleIdToken(id_token);
    const provider = 'google';
    const providerId = payload?.sub as string;
    const email = payload?.email as string | undefined;
    const name = payload?.name as string | undefined;

    const user = await findOrCreateUserFromSocial(provider, providerId, email, name);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user });
  } catch (err: any) {
    console.error('google/token error', err?.message || err);
    return res.status(500).json({ erro: 'erro ao verificar token google', details: err?.message });
  }
});

// For Apple: exchange authorization code server-side, then create/find user and return JWT
router.post('/apple/token', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ erro: 'code necessário' });

    const tokenResponse = await exchangeAppleCode(code);
    const id_token = tokenResponse.id_token as string | undefined;
    // NOTE: full verification of Apple's id_token (JWKS) is recommended; here we decode payload for pragmatic flow
    const decoded = id_token ? JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString()) : null;
    const provider = 'apple';
    const providerId = decoded?.sub as string;
    const email = decoded?.email as string | undefined;
    const name = decoded?.name || decoded?.email || 'Usuário Apple';

    const user = await findOrCreateUserFromSocial(provider, providerId, email, name);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user });
  } catch (err: any) {
    console.error('apple/token error', err?.message || err);
    return res.status(500).json({ erro: 'erro ao trocar code apple', details: err?.message });
  }
});

export default router;
