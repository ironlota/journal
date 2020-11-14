import auth from 'utils/auth'

export default auth(
  process.env.NODE_ENV === 'production'
    ? 'https://journal.rayandrew.me/api/auth/callback'
    : 'http://localhost:3000/api/auth/callback',
)
