import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { Client } from "../../models/client.model";

export const signupClient = catchAsync(async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return res
      .status(409)
      .json({ error: "An account with this email already exists" });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert([{ name, phone, email, password }])
    .select();

  if (error) return res.status(400).json({ error });

  res.status(201).json({
    message: "Account created successfully",
    client: {
      id: (data[0] as Client).id,
      name: (data[0] as Client).name,
      email: (data[0] as Client).email,
      phone: (data[0] as Client).phone,
    },
  });
});
