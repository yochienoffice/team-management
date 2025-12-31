// models/League.ts
import clientPromise from "@/lib/db";
import { Db, Collection } from "mongodb";

export interface ILeague {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

let db: Db;
let leagueCollection: Collection<ILeague>;
let countersCollection: Collection<{ _id: string; sequence_value: number }>;


/** 初始化 MongoDB */
async function init() {
  if (leagueCollection) return;

  const client = await clientPromise;
  db = client.db("team-management-brother");
  leagueCollection = db.collection<ILeague>("league");
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
export async function getLeagues(): Promise<ILeague[]> {
  await init();
  const leagues = await leagueCollection.find({}).toArray();
  return leagues.map(({ _id, ...rest }) => rest);
}

/** 新增單筆 stat */
export async function createLeague(data: Omit<ILeague, "id">) {
  await init();
  const nextId = await getNextSequence("league_id");
  const doc: ILeague = { ...defaultLeague, ...data, id: nextId };
  await leagueCollection.insertOne(doc);
  return doc;
}

const defaultLeague = {
  season: "",
  startDate: "",
  endDate: "",
  notes: ""
};

/** 更新 stat */
export async function updateLeague(number: number, updateData: Partial<ILeague>) {
  await init();
  await leagueCollection.updateOne({ number }, { $set: updateData });
  return leagueCollection.findOne({ number }) as Promise<ILeague>;
}

/** 刪除 stat */
export async function deleteLeague(number: number) {
  await init();
  return leagueCollection.deleteOne({ number });
}
