export function mangleEmail(email: string) {
  return email.slice(0, 2) + '****@****' + email.slice(-6);
}
