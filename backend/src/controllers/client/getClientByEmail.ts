import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Client } from "../../models/client.model";

export const getClientByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Client not found" });
  }

  res.status(200).json({ client: data as Client });
});
