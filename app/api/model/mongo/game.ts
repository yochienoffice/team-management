import clientPromise from "@/lib/db";
import { Db, Collection } from "mongodb";

export interface IGame {
  id: number,
  leagueId: number;
  date: Date;
  location: string;
  opponent: string;
  isHome: boolean;
  score: number;
  opponentScore: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

let db: Db;
let gameCollection: Collection<IGame>;
let countersCollection: Collection<{ _id: string; sequence_value: number }>;

/** 初始化 MongoDB */
async function init() {
  if (gameCollection && countersCollection) return;

  const client = await clientPromise;
  db = client.db("team-management-brother");
  gameCollection = db.collection<IGame>("game");
  countersCollection = db.collection<{ _id: string; sequence_value: number }>(
    "counters"
  );
}

/** 取得下一個自動遞增 id */
async function getNextSequence(name: string) {
  await init();

  // 確保 counter document 已存在
  await countersCollection.updateOne(
    { _id: name },
    { $setOnInsert: { sequence_value: 0 } },
    { upsert: true }
  );

  // 更新並取得新的 sequence_value
  const result = await countersCollection.findOneAndUpdate(
    { _id: name },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after", upsert: true } // 4.x 用 returnDocument: "after"
  );

  // 安全檢查
  if (!result.value) {
    // 如果 result.value 還是 null，手動讀回來
    const doc = await countersCollection.findOne({ _id: name });
    if (!doc) throw new Error("Failed to get sequence value");
    return doc.sequence_value;
  }

  return result.value.sequence_value;
}

/** 取得所有 stats */
export async function getGames(): Promise<IGame[]> {
  await init();
  const games = await gameCollection.find({}).toArray();
  return games.map(({ _id, ...rest }) => rest);
}

/** 新增單筆 stat */
export async function createGame(data: Omit<IGame, "id">) {
  await init();
  const nextId = await getNextSequence("game_id");
  const doc: IGame = { ...defaultStats, ...data, id: nextId };
  await gameCollection.insertOne(doc);
  return doc;
}

const defaultStats = {
  isHome: false,
  score: 0,
  opponentScore: 0,
  status: 'SCHEDULED'
};

/** 批量新增 stats */
export async function createManyGames(dataArray: Omit<IGame, "id">[]) {
  await init();
  const docs: IGame[] = [];
  for (const data of dataArray) {
    const nextId = await getNextSequence("game_id");
    docs.push({ id: nextId, ...defaultStats, ...data });
  }
  await gameCollection.insertMany(docs);
  return docs;
}

/** 更新 stat */
export async function updateGame(id: number, updateData: Partial<IGame>) {
  await init();
  await gameCollection.updateOne({ id }, { $set: updateData });
  return gameCollection.findOne({ id }) as Promise<IGame>;
}

/** 刪除 stat */
export async function deleteGame(id: number) {
  await init();
  return gameCollection.deleteOne({ id });
}
