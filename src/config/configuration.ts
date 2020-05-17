export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  db: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_UNAME,
    password: process.env.DB_PASS,
    entities: ['dist/**/*.entity.{js,ts}'],
    sync: process.env.DB_SYNC === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
