import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Client } from "../../models/client.model";

export const updateClient = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updateData = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email ?? null,
    password: req.body.password,
  };

  const { data, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  res.status(200).json({ client: data[0] as Client });
});
