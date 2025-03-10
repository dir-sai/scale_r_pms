export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPhoneNumber(phone: string): string {
  // Assuming Ghana phone number format: +233 XX XXX XXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12) { // Including country code
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.length === 10) { // Local number
    return `+233 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone; // Return original if format doesn't match
} 