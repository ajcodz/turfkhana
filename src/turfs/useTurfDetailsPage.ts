import { useQuery } from "@tanstack/react-query";
import type { Turf } from "../../backend/src/models/turf.model";
import { APP_BASE_URL } from "../utils/api";


const fetchTurfById = async (id: string): Promise<Turf> => {
  const res = await fetch(`${APP_BASE_URL}/turfs/${id}`);
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("Failed to fetch turf");
  const data = await res.json();
  return data.turf;
};

export const useTurf = (id: string) => {
  return useQuery({
    queryKey: ["turf", id],
    queryFn: () => fetchTurfById(id),
    enabled: !!id,
  });
};
