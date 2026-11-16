import type { Currency } from '../types';

export const EUR_TO_XOF_RATE = 655.957;

export function formatPrice(amountEur: number, currency: Currency): string {
  if (currency === 'XOF') {
    const xof = Math.round(amountEur * EUR_TO_XOF_RATE);
    return `${xof.toLocaleString('fr-FR')} FCFA`;
  }
  return `${amountEur.toLocaleString('fr-FR')} €`;
}

export function formatDualPrice(amountEur: number, activeCurrency: Currency): { primary: string; secondary: string } {
  const primary = formatPrice(amountEur, activeCurrency);
  const altCurrency: Currency = activeCurrency === 'EUR' ? 'XOF' : 'EUR';
  const secondary = `≈ ${formatPrice(amountEur, altCurrency)}`;
  return { primary, secondary };
}
