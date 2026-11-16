import { api } from "@/lib/api/client";
import type { ClubEvent, PublicStats } from "@/lib/types";

/**
 * Server-callable data access for public pages (used from route loaders).
 * TODO: back with a real data source.
 */
export async function listEvents(limit = 100): Promise<ClubEvent[]> {
  const page = await api.entities.ClubEvent.list({
    sort: "start_date",
    limit,
  });
  return (page.items ?? []) as ClubEvent[];
}

export async function getEvent(id: string): Promise<ClubEvent | null> {
  try {
    return (await api.entities.ClubEvent.get(id)) as ClubEvent;
  } catch {
    return null;
  }
}

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const res = await api.functions.invoke("publicStats", {});
    return (res.data as PublicStats | null) ?? null;
  } catch {
    return null;
  }
}
