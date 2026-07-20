import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { signToken } from "../../utils/jwt";

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

  if (!data.is_active) {
    return res.status(403).json({
      error: "This account has been deactivated. Please contact support.",
    });
  }

  const token = signToken({ id: data.id, role: "owner" });

  res.cookie("owner_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

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
