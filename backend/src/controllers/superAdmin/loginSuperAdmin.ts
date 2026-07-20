import { supabase } from "../../db/config";
import { catchAsync } from "../../utils/catchAsync";
import { signToken } from "../../utils/jwt";

export const loginSuperAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase
    .from("super_admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (data.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ id: data.id, role: "super_admin" });

  res.cookie("super_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Login successful",
    superAdmin: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
  });
});
