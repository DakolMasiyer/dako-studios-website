import { SignJWT, jwtVerify } from 'jose'

// Fail closed: a missing secret must NOT silently fall back to a known key,
// which would make every issued token forgeable. Resolved lazily so the build
// (which may not have env vars) doesn't crash at import time.
function getKey() {
  const secretKey = process.env.MARKETING_SESSION_SECRET
  if (!secretKey) {
    throw new Error('MARKETING_SESSION_SECRET is not set')
  }
  return new TextEncoder().encode(secretKey)
}

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}
