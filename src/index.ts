import dotenv from "dotenv";
import passport from "passport";
import app from "./routes/routes";

dotenv.config();

import "./config/db_config";

app.set("port", process.env.PORT || 3000);

app.use(passport.initialize());

app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

export default app;
