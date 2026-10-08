import { getUserInitials } from "@/lib/user";

export function InitialsAvatar({ user, className }) {
  return <span className={className} aria-hidden="true">{getUserInitials(user)}</span>;
}
