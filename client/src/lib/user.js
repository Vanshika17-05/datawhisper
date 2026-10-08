function firstCharacter(value) {
  return Array.from(value)[0] || "";
}

export function getUserInitials(user) {
  const words = typeof user?.name === "string" ? user.name.trim().split(/\s+/u).filter(Boolean) : [];
  const nameInitials = words.length > 1
    ? `${firstCharacter(words[0])}${firstCharacter(words.at(-1))}`
    : firstCharacter(words[0] || "");
  const fallback = firstCharacter(typeof user?.email === "string" ? user.email.trim() : "");
  return Array.from((nameInitials || fallback || "?").toLocaleUpperCase()).slice(0, 2).join("");
}
