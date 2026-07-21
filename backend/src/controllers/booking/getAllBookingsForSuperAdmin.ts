import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const getAllBookingsForSuperAdmin = catchAsync(async (req, res) => {
  const [bookingsRes, turfsRes, clientsRes, ownersRes] = await Promise.all([
    supabase.from("bookings").select("*").order("id", { ascending: false }),
    supabase.from("turfs").select("id, name, owner_id"),
    supabase.from("clients").select("id, name, phone"),
    supabase.from("owners").select("id, name"),
  ]);

  if (bookingsRes.error)
    return res.status(400).json({ error: bookingsRes.error });
  if (turfsRes.error) return res.status(400).json({ error: turfsRes.error });
  if (clientsRes.error)
    return res.status(400).json({ error: clientsRes.error });
  if (ownersRes.error) return res.status(400).json({ error: ownersRes.error });

  const turfMap = new Map(turfsRes.data.map((t: any) => [t.id, t]));
  const clientMap = new Map(clientsRes.data.map((c: any) => [c.id, c]));
  const ownerMap = new Map(ownersRes.data.map((o: any) => [o.id, o]));

  const bookings = bookingsRes.data.map((b: any) => {
    const turf = turfMap.get(b.turf_id) as any;
    const client = clientMap.get(b.client_id) as any;
    const owner = turf ? (ownerMap.get(turf.owner_id) as any) : null;

    return {
      ...b,
      turf_name: turf?.name ?? "Unknown Turf",
      owner_name: owner?.name ?? "Unknown Owner",
      client_name: client?.name ?? "Unknown Client",
      client_phone: client?.phone ?? "—",
    };
  });

  res.json({ bookings });
});
