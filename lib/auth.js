const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cme-admin";

// The client URI-encodes the password so that any character (including
// non-Latin-1 ones, which raw HTTP headers can't carry) survives transit.
export function isAuthorized(request) {
  const provided = request.headers.get("x-admin-password");
  if (typeof provided !== "string") return false;
  try {
    return decodeURIComponent(provided) === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export function unauthorized() {
  return Response.json({ error: "Invalid password." }, { status: 401 });
}
