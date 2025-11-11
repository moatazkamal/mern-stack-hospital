// backends/utils/jwtToken.js
export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true only behind HTTPS
      path: "/",
      expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    })
    .json({ success: true, message, user, token });
};
