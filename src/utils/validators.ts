export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
}

export function validateDateRange(start: string, end: string): string | null {
  if (!start) return 'Start date is required';
  if (!end) return 'End date is required';
  if (new Date(start) >= new Date(end)) return 'End date must be after start date';
  return null;
}

export function validateCapacity(capacity: string): string | null {
  if (!capacity) return null; // Optional field
  const num = parseInt(capacity, 10);
  if (isNaN(num) || num < 1) return 'Capacity must be a positive number';
  return null;
}
