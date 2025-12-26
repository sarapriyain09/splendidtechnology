type WhatsAppChatButtonProps = {
  phoneNumber: string;
  message?: string;
};

function toWaMeNumber(phoneNumber: string): string {
  // WhatsApp wa.me expects digits only, including country code.
  return phoneNumber.replace(/\D/g, "");
}

function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const waNumber = toWaMeNumber(phoneNumber);
  const base = `https://wa.me/${waNumber}`;

  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppChatButton({
  phoneNumber,
  message,
}: WhatsAppChatButtonProps) {
  const href = buildWhatsAppUrl(phoneNumber, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0b3d91] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d91]/30"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp Chat
    </a>
  );
}
