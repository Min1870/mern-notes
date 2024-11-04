import { connectToDb } from "./db/connectToDb";
import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectToDb();
  console.log(`Server running at http://localhost:${PORT}`);
});
