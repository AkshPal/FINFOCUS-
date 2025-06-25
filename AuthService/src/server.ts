import express from "express";
import dotenv from "dotenv";
import passport from './utils/passport.js';
import authRouter from "./routes/auth.js";
import sequelize from './utils/db.js';



const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRouter);

(async () => {
  await sequelize.sync({ alter: true });  // Create tables if not exist
  const PORT = process.env.PORT || 5000;;
  app.listen(PORT, () => console.log(`✅ Auth service running on port ${PORT}`));
})();


