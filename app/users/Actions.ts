import { createPlayer } from "../api/model/mongo/player";
import { MemberSchema } from "./Validations";

export async function updateUser(input: MemberSchema & { id: number }) {
  const player = {
    number: input.number,
    displayName: input.displayName,
    birthDate: input.birthDate,
  };
  const result = await fetch("/api/player/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
  console.log("All created players:", result);

  return {
    data: null,
    error: null,
  };
}

export async function createUser(input: MemberSchema & { id: number }) {
  const player = {
    number: input.number,
    displayName: input.displayName,
    birthDate: input.birthDate,
  };
  const result = await fetch("/api/player/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
  console.log("All created players:", result);

  return {
    data: null,
    error: null,
  };
}
