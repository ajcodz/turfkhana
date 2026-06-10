import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Owner } from "../../models/owner.model";

export const updateOwner = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updateData = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email ?? null,
  };

  const { data, error } = await supabase
    .from("owners")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  res.status(200).json({ owner: data[0] as Owner });
});
