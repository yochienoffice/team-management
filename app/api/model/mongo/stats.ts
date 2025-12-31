import clientPromise from "@/lib/db";
import { Db, Collection } from "mongodb";

export interface IStats {
  id?: number;
  gameId: number;
  playerId: number;
  pa: number;
  atBats: number;
  hits: number;
  rbis: number;
  runs: number;
  strikeouts: number;
  walks: number;
  doubles: number;
  triples: number;
  homeruns: number;
  doublePlays?: number;
  sacrifices?: number;
  notes?: string;
}

let db: Db;
let statsCollection: Collection<IStats>;
let countersCollection: Collection<{ _id: string; sequence_value: number }>;

/** 初始化 MongoDB */
async function init() {
  if (statsCollection && countersCollection) return;

  const client = await clientPromise;
  db = client.db("team-management-brother");
  statsCollection = db.collection<IStats>("stats");
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
export async function getStats(): Promise<IStats[]> {
  await init();
  return statsCollection.find({}).toArray();
}

export async function getAggregatedStats() {
  await init();

  return statsCollection.aggregate([
    {
      $lookup: {
        from: "player",
        localField: "playerId",
        foreignField: "number",
        as: "player"
      }
    },
    { $unwind: "$player" },
    {
      $group: {
        _id: "$playerId",
        number: { $first: "$player.number" },
        name: { $first: "$player.displayName" },
        pa: { $sum: "$pa" },
        atBats: { $sum: "$atBats" },
        hits: { $sum: "$hits" },
        rbis: { $sum: "$rbis" },
        runs: { $sum: "$runs" },
        strikeouts: { $sum: "$strikeouts" },
        walks: { $sum: "$walks" },
        doubles: { $sum: "$doubles" },
        triples: { $sum: "$triples" },
        homeruns: { $sum: "$homeruns" },
        doublePlays: { $sum: "$doublePlays" },
        sacrifices: { $sum: "$sacrifices" }
      }
    },
    { $sort: { number: 1 } } // 排序 (選擇性)
  ]).toArray();
}

export async function getStatsByGameId(gameId: number): Promise<IStats[]> {
  await init();
  const docs = await statsCollection.find({ gameId }).toArray();4
  return docs.map(({ _id, ...rest }) => rest);
}

export async function getStatsByPlayerId(playerId: number): Promise<IStats[]> {
  await init();
  const docs = await statsCollection.find({ playerId }).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

/** 新增單筆 stat */
export async function createStat(data: Omit<IStats, "id">) {
  await init();
  const nextId = await getNextSequence("stats_id");
  const doc: IStats = { id: nextId, ...data };
  await statsCollection.insertOne(doc);
  return doc;
}

const defaultStats = {
  pa: 0,
  atBats: 0,
  hits: 0,
  rbis: 0,
  runs: 0,
  strikeouts: 0,
  walks: 0,
  doubles: 0,
  triples: 0,
  homeruns: 0,
  notes: "",
  doublePlays: 0,
  sacrifices: 0
};

/** 批量新增 stats */
export async function createManyStats(dataArray: (Partial<IStats> & { id?: number })[]) {
  await init();
  const operations = [];

  for (const data of dataArray) {
    // 如果 data傳來沒有 id，代表是新增 → 自己取 id
    const id = data.id ?? await getNextSequence("stats_id");

    operations.push({
      updateOne: {
        filter: { id },
        update: {
          $set: { ...defaultStats, ...data, id }
        },
        upsert: true, // 核心：找不到就 insert
      }
    });
  }

  const result = await statsCollection.bulkWrite(operations);
  return result;
}

/** 更新 stat */
export async function updateStat(id: number, updateData: Partial<IStats>) {
  await init();
  await statsCollection.updateOne({ id }, { $set: updateData });
  return statsCollection.findOne({ id }) as Promise<IStats>;
}

export async function updateManyStats(stats: IStats[]) {
  await init();

  if (!stats.length) return [];

  const bulkOps = stats.map(stat => ({
    updateOne: {
      filter: { id: stat.id },
      update: { $set: stat }
    }
  }));

  const result = await statsCollection.bulkWrite(bulkOps);
  return result;
}

/** 刪除 stat */
export async function deleteStat(id: number) {
  await init();
  return statsCollection.deleteOne({ id });
}
