import type { User } from "@supabase/supabase-js";
import type { GuestUser } from "../types/guest";

export function toGuestUser(user: User): GuestUser {
  const metadataName = user.user_metadata.nome;
  const name = typeof metadataName === "string" && metadataName.trim()
    ? metadataName.trim()
    : user.phone ?? "Hóspede Kennet";
  const phone = user.phone ?? "";
  const username = name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9._-]/g, "");

  return {
    username,
    name,
    cell: phone.replace(/^\+258/, ""),
    clientCode: `KEN-MZ-${user.id.replace(/-/g, "").slice(0, 4).toUpperCase()}`,
    role: "guest",
    status: "Ativo",
    avatar: name.slice(0, 2).toUpperCase(),
  };
}
