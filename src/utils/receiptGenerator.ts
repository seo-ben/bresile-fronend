import type { SiteSettings } from '../components/SiteSettingsContext';
import type { Language } from '../i18n/LanguageContext';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  amountFormatted: string;
  amountNumber: number;
  currency: string;
  paymentMethod: string;
  gatewayReference?: string | null;
  purpose: string;
}

function numberToWordsSimple(n: number, lang: Language): string {
  const rounded = Math.round(n);
  if (lang === 'en') {
    return `${rounded.toLocaleString('en-US')} ${n % 1 !== 0 ? `and ${Math.round((n % 1) * 100)}/100` : ''}`.trim();
  }
  if (lang === 'pt') {
    return `${rounded.toLocaleString('pt-BR')} ${n % 1 !== 0 ? `e ${Math.round((n % 1) * 100)}/100` : ''}`.trim();
  }
  return `${rounded.toLocaleString('fr-FR')} ${n % 1 !== 0 ? `virgule ${Math.round((n % 1) * 100)}` : ''}`.trim();
}

export function openOfficialReceipt(
  receipt: ReceiptData,
  site: SiteSettings,
  lang: Language
): void {
  const labels =
    lang === 'en'
      ? {
          title: 'RECEIPT',
          receiptNo: 'MR. NO.',
          date: 'Date',
          receivedFrom: 'Received with thanks from',
          amountInWord: 'Amount',
          by: 'By',
          cash: 'Cash',
          transfer: 'Bank Transfer',
          card: 'Credit Card',
          refNo: 'Ref No.',
          purpose: 'For the purpose of',
          contactNo: 'Contact No.',
          receivedBy: 'Received By',
          authorizedSig: 'Authorized Signature',
          printBtn: 'Download / Print PDF',
        }
      : lang === 'pt'
      ? {
          title: 'RECIBO',
          receiptNo: 'Nº RECIBO',
          date: 'Data',
          receivedFrom: 'Recebemos com agradecimento de',
          amountInWord: 'Valor',
          by: 'Via',
          cash: 'Dinheiro',
          transfer: 'Transferência',
          card: 'Cartão Bancário',
          refNo: 'Ref. Nº',
          purpose: 'Referente a',
          contactNo: 'Telefone',
          receivedBy: 'Recebido por',
          authorizedSig: 'Assinatura Autorizada',
          printBtn: 'Baixar / Imprimir PDF',
        }
      : {
          title: 'REÇU',
          receiptNo: 'N° REÇU',
          date: 'Date',
          receivedFrom: 'Reçu avec remerciements de',
          amountInWord: 'Montant',
          by: 'Par',
          cash: 'Espèces',
          transfer: 'Virement',
          card: 'Carte Bancaire',
          refNo: 'Réf. N°',
          purpose: 'Pour le motif de',
          contactNo: 'Téléphone',
          receivedBy: 'Reçu par',
          authorizedSig: 'Signature Autorisée',
          printBtn: 'Télécharger / Imprimer en PDF',
        };

  const isCard = receipt.paymentMethod !== 'bank_transfer' && receipt.paymentMethod !== 'cash';
  const isTransfer = receipt.paymentMethod === 'bank_transfer';
  const isCash = receipt.paymentMethod === 'cash';

  const currencyLabel =
    receipt.currency === 'XOF' ? 'FCFA' : receipt.currency === 'BRL' ? 'R$' : 'EUR';
  const amountLine = `${receipt.amountFormatted} (${numberToWordsSimple(receipt.amountNumber, lang)} ${currencyLabel})`;
  const safeLogo = site.logo_url || `${window.location.origin}/logo.png`;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${labels.title} — ${receipt.receiptNumber}</title>
  <style>
    @page {
      size: 240mm 132mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      padding: 28px;
      color: #1e293b;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }
    .print-toolbar {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 900px;
      justify-content: flex-end;
    }
    .print-btn {
      background: #0f294a;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .print-btn:hover { background: #1e3a8a; }
    .receipt-sheet {
      position: relative;
      width: 100%;
      max-width: 900px;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.14);
      border: 1px solid #e2e8f0;
      padding: 36px 86px 40px 64px;
    }
    /* Left navy + green ribbon matching reference */
    .ribbon-left-green {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 72%;
      background: #7bc143;
      border-bottom-right-radius: 26px;
      z-index: 1;
    }
    .ribbon-left {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 68%;
      background: #0f294a;
      border-bottom-right-radius: 26px;
      z-index: 2;
    }
    /* Right navy + green vertical RECEIPT ribbon */
    .ribbon-right-green {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 58px;
      height: 70%;
      background: #7bc143;
      border-top-left-radius: 28px;
      z-index: 1;
    }
    .ribbon-right {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 58px;
      height: 66%;
      background: #0f294a;
      border-top-left-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }
    .ribbon-right-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 0.16em;
      color: transparent;
      -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.72);
      user-select: none;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 34px;
      gap: 20px;
    }
    .brand-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 150px;
    }
    .brand-col img {
      height: 58px;
      width: auto;
      max-width: 130px;
      object-fit: contain;
      margin-bottom: 6px;
    }
    .brand-col .brand-name {
      font-size: 19px;
      font-weight: 900;
      color: #0f294a;
      letter-spacing: 0.03em;
    }
    .brand-col .brand-sub {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      text-align: center;
      max-width: 180px;
      margin-top: 2px;
    }
    .center-title {
      font-size: 40px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: #1e293b;
      padding-top: 10px;
    }
    .contact-col {
      text-align: right;
      font-size: 12.5px;
      color: #334155;
      line-height: 1.75;
    }
    .contact-line {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .contact-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 5px;
      border: 1px solid #334155;
      font-size: 10px;
      color: #0f294a;
    }
    .line-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 18px;
      font-size: 14px;
    }
    .line-row.two-col {
      justify-content: space-between;
      gap: 24px;
    }
    .field-pair {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex: 1;
    }
    .field-label {
      white-space: nowrap;
      color: #334155;
      font-weight: 500;
    }
    .dotted-value {
      flex: 1;
      border-bottom: 1.5px dotted #94a3b8;
      padding: 0 6px 3px 6px;
      font-weight: 700;
      color: #0f172a;
      min-height: 22px;
    }
    .checkbox-group {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      margin-right: 12px;
      white-space: nowrap;
    }
    .chk-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 13.5px;
    }
    .chk-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border: 1.5px solid #334155;
      border-radius: 2px;
      font-size: 10px;
      font-weight: 900;
      color: #0f294a;
    }
    .footer-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 34px;
      gap: 24px;
    }
    .amount-box-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .amount-curr {
      font-weight: 800;
      font-size: 15px;
      color: #0f294a;
    }
    .amount-box {
      min-width: 165px;
      height: 44px;
      border: 1.5px solid #475569;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
      color: #0f294a;
      padding: 0 14px;
    }
    .sig-col {
      display: flex;
      gap: 44px;
    }
    .sig-block {
      text-align: center;
      min-width: 150px;
    }
    .sig-value {
      font-family: "Brush Script MT", "Segoe Script", cursive;
      font-size: 19px;
      color: #0f294a;
      min-height: 24px;
    }
    .sig-line {
      border-top: 1.5px solid #334155;
      padding-top: 6px;
      font-size: 12.5px;
      color: #334155;
      font-weight: 600;
    }
    @media print {
      html, body {
        width: 240mm;
        height: 132mm;
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block;
      }
      .print-toolbar { display: none !important; }
      .receipt-sheet {
        width: 240mm !important;
        max-width: 240mm !important;
        height: 132mm !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        padding: 32px 86px 32px 64px !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <button class="print-btn" onclick="window.print()">${labels.printBtn}</button>
  </div>

  <div class="receipt-sheet">
    <div class="ribbon-left-green"></div>
    <div class="ribbon-left"></div>
    <div class="ribbon-right-green"></div>
    <div class="ribbon-right">
      <span class="ribbon-right-text">${labels.title}</span>
    </div>

    <div class="header-row">
      <div class="brand-col">
        <img src="${safeLogo}" alt="${site.site_name}" />
        <div class="brand-name">${site.site_name}</div>
        <div class="brand-sub">${site.tagline || ''}</div>
      </div>

      <div class="center-title">${labels.title}</div>

      <div class="contact-col">
        <div class="contact-line">
          <span>${site.contact_address || 'Brasília, DF — Brésil'}</span>
          <span class="contact-icon">⌖</span>
        </div>
        <div class="contact-line">
          <span>${site.contact_email || 'contact@brasil-e.com'}</span>
          <span class="contact-icon">✉</span>
        </div>
        <div class="contact-line">
          <span>${site.website_url || 'www.brasil-e.com'}</span>
          <span class="contact-icon">🌐</span>
        </div>
        <div class="contact-line">
          <span>${site.contact_phone || '+55 61 99999-0000'}</span>
          <span class="contact-icon">☎</span>
        </div>
      </div>
    </div>

    <div class="line-row two-col">
      <div class="field-pair" style="max-width: 280px;">
        <span class="field-label">${labels.receiptNo}</span>
        <span class="dotted-value">${receipt.receiptNumber}</span>
      </div>
      <div class="field-pair" style="max-width: 240px;">
        <span class="field-label">${labels.date}</span>
        <span class="dotted-value">${receipt.date}</span>
      </div>
    </div>

    <div class="line-row">
      <span class="field-label">${labels.receivedFrom}</span>
      <span class="dotted-value">${receipt.studentName} (${receipt.studentEmail})</span>
    </div>

    <div class="line-row">
      <span class="field-label">${labels.amountInWord}</span>
      <span class="dotted-value">${amountLine}</span>
    </div>

    <div class="line-row">
      <span class="field-label">${labels.by}</span>
      <div class="checkbox-group">
        <span class="chk-item"><span class="chk-box">${isCash ? '✓' : ''}</span> ${labels.cash}</span>
        <span class="chk-item"><span class="chk-box">${isTransfer ? '✓' : ''}</span> ${labels.transfer}</span>
        <span class="chk-item"><span class="chk-box">${isCard ? '✓' : ''}</span> ${labels.card}</span>
      </div>
      <span class="field-label">${labels.refNo}</span>
      <span class="dotted-value">${receipt.gatewayReference || receipt.receiptNumber}</span>
    </div>

    <div class="line-row two-col">
      <div class="field-pair" style="flex: 1.4;">
        <span class="field-label">${labels.purpose}</span>
        <span class="dotted-value">${receipt.purpose}</span>
      </div>
      <div class="field-pair" style="flex: 0.9;">
        <span class="field-label">${labels.contactNo}</span>
        <span class="dotted-value">${receipt.studentPhone || '—'}</span>
      </div>
    </div>

    <div class="footer-row">
      <div class="amount-box-wrap">
        <span class="amount-curr">${currencyLabel}</span>
        <div class="amount-box">${receipt.amountFormatted}</div>
      </div>

      <div class="sig-col">
        <div class="sig-block">
          <div class="sig-value">${site.site_name}</div>
          <div class="sig-line">${labels.receivedBy}</div>
        </div>
        <div class="sig-block">
          <div class="sig-value">Direction</div>
          <div class="sig-line">${labels.authorizedSig}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=980,height=740');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}
