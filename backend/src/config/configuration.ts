export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    db_host: process.env.POSTGRES_HOST || '127.0.0.1',
    db_port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    db_name: process.env.POSTGRES_DB || 'kupipodariday',
    db_user: process.env.POSTGRES_USER || 'student',
    db_pass: process.env.POSTGRES_PASSWORD || 'student',
    synchronize: (process.env.SYNCHRONIZE || '1') === '1',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'SECRET',
  },
});
