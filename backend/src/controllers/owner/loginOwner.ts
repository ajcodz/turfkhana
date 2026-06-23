import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";

export const loginOwner = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (data.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    owner: {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
  });
});
