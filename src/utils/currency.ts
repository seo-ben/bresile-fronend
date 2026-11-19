import type { Currency } from '../types';

export const EUR_TO_XOF_RATE = 655.957;
export const EUR_TO_BRL_RATE = 6.15;

export function formatPrice(amountEur: number, currency: Currency): string {
  if (currency === 'XOF') {
    const xof = Math.round(amountEur * EUR_TO_XOF_RATE);
    return `${xof.toLocaleString('fr-FR')} FCFA`;
  }
  if (currency === 'BRL') {
    const brl = Math.round(amountEur * EUR_TO_BRL_RATE * 100) / 100;
    return `R$ ${brl.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${amountEur.toLocaleString('fr-FR')} €`;
}

export function formatDualPrice(amountEur: number, activeCurrency: Currency): { primary: string; secondary: string } {
  const primary = formatPrice(amountEur, activeCurrency);
  const others: Currency[] = (['EUR', 'XOF', 'BRL'] as Currency[]).filter((c) => c !== activeCurrency);
  const secondary = `≈ ${others.map((c) => formatPrice(amountEur, c)).join(' • ')}`;
  return { primary, secondary };
}
