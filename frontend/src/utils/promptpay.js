const DEFAULT_PROMPTPAY_ACCOUNT = import.meta.env.VITE_PROMPTPAY_ACCOUNT || '0812345678';

const toAmount = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '0.00';
  return num.toFixed(2);
};

export const buildPromptPayPayload = ({ amount, reference }) => {
  const ref = String(reference || `PAY-${Date.now()}`).trim();
  return `promptpay://pay?recipient=${encodeURIComponent(DEFAULT_PROMPTPAY_ACCOUNT)}&amount=${encodeURIComponent(toAmount(amount))}&ref=${encodeURIComponent(ref)}`;
};

export const buildPromptPayQrUrl = ({ amount, reference, size = 260 }) => {
  const payload = buildPromptPayPayload({ amount, reference });
  return `https://quickchart.io/qr?size=${encodeURIComponent(size)}&text=${encodeURIComponent(payload)}`;
};

export const getPromptPayAccount = () => DEFAULT_PROMPTPAY_ACCOUNT;
