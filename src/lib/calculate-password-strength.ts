/**
 * Calculate the strength of a password based on a set of rules
 * @param password The password to calculate the strength of
 * @returns A number between 0 and 100 representing the strength of the password
 */
export function calculatePasswordStrength(password: string) {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.match(/[A-Z]/)) strength += 20;
  if (password.match(/[a-z]/)) strength += 20;
  if (password.match(/[0-9]/)) strength += 20;
  if (password.match(/[^A-Za-z0-9]/)) strength += 20;
  return strength;
}
