import clientPromise from "@/lib/db";
import { Db, Collection } from "mongodb";

export interface IPlayer {
  number: number;
  displayName: string;
  birthDate: string;
}

let db: Db;
let playerCollection: Collection<IPlayer>;

/** 初始化 MongoDB */
async function init() {
  if (playerCollection) return;

  const client = await clientPromise;
  db = client.db("team-management-brother");
  playerCollection = db.collection<IPlayer>("player");
}

/** 取得所有 stats */
export async function getPlayers(): Promise<IPlayer[]> {
  await init();
  const games = await playerCollection.find({}).toArray();
  return games.map(({ _id, ...rest }) => rest);
}

/** 新增單筆 stat */
export async function createPlayer(data: IPlayer) {
  await init();
  const doc: IPlayer = { ...data };
  await playerCollection.insertOne(doc);
  return doc;
}

const defaultPlayer = {
  identity: "0000000000"
};

/** 更新 stat */
export async function updatePlayer(number: number, updateData: Partial<IPlayer>) {
  await init();
  await playerCollection.updateOne({ number }, { $set: updateData });
  return playerCollection.findOne({ number }) as Promise<IPlayer>;
}

/** 刪除 stat */
export async function deletePlayer(number: number) {
  await init();
  return playerCollection.deleteOne({ number });
}
