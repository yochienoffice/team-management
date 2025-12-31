import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://yoposTesting:jNtwSY32xTRIJf5z@team-management.jgvekzw.mongodb.net/?retryWrites=true&w=majority&tls=true";
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
   // 開發模式：重載時共用同一個 promise
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // 生產環境：每次直接連線
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
