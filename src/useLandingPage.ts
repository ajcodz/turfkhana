import { useQuery } from "@tanstack/react-query";
import { type Turf } from "../backend/src/models/turf.model";
import { APP_BASE_URL } from "./utils/api";


const fetchTurfs = async (): Promise<Turf[]> => {
    const res = await fetch(`${APP_BASE_URL}/turfs`);
    if (!res.ok) throw new Error("Failed to fetch turfs");
    const data = await res.json();
    return data.turfs; // adjust based on your API response shape
};

export const useTurfs = () => {
    return useQuery({
        queryKey: ["turfs"],
        queryFn: fetchTurfs,
    });
};