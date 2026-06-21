/**
 * Authorize a cron request. Vercel Cron automatically sends
 * `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set in the project env.
 * We reject anything that doesn't match so the outreach routes can't be triggered
 * by a random web request.
 *
 * If CRON_SECRET is unset (e.g. local dev), we allow the call so routes remain
 * testable — but they are still gated by OUTREACH_DRY_RUN for anything that sends.
 */
export function isAuthorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  const auth = req.headers.get('authorization') || ''
  return auth === `Bearer ${secret}`
}
