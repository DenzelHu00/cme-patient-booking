const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cme-admin";

export function isAuthorized(request) {
  const provided = request.headers.get("x-admin-password");
  return typeof provided === "string" && provided === ADMIN_PASSWORD;
}

export function unauthorized() {
  return Response.json({ error: "Invalid password." }, { status: 401 });
}
