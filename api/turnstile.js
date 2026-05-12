export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  try {
    const { token } = req.body || {};
    if (!token) {
      return res.status(400).json({ success: false, message: "Missing token" });
    }

    // Test secret key tương ứng với test site key "1x00000000000000000000AA"
    // Key này luôn trả về success=true, dùng để test không cần config domain
    const secret = process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAADNl8HkTV51k79F7xXN0Y0uCccg";

    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const data = await cfRes.json();

    if (!data.success) {
      return res.status(200).json({
        success: false,
        message: "Turnstile verify failed",
        errorCodes: data["error-codes"] || []
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error"
    });
  }
}
