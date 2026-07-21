import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getMyClients = catchAsync(async (req, res) => {
  const ownerId = req.user!.id;

  const { data: turfs, error: turfsError } = await supabase
    .from("turfs")
    .select("id")
    .eq("owner_id", ownerId);

  if (turfsError) return res.status(400).json({ error: turfsError });

  const turfIds = (turfs ?? []).map((t: any) => t.id);

  if (turfIds.length === 0) {
    return res.json({ clients: [] });
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("client_id")
    .in("turf_id", turfIds);

  if (bookingsError) return res.status(400).json({ error: bookingsError });

  const clientIds = [...new Set((bookings ?? []).map((b: any) => b.client_id))];

  if (clientIds.length === 0) {
    return res.json({ clients: [] });
  }

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("id, name, phone, email")
    .in("id", clientIds);

  if (clientsError) return res.status(400).json({ error: clientsError });

  res.json({ clients });
});
