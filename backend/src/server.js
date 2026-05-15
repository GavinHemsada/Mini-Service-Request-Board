require("dotenv").config();
const { app } = require("./app");
const { connectDb } = require("./config/db");

const port = Number(process.env.PORT) || 4000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
