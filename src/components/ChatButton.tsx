type ChatButtonProps = {
  phoneNumber: string;
  message?: string;
};

function toChatNumber(phoneNumber: string): string {
  // wa.me expects digits only, including country code.
  return phoneNumber.replace(/\D/g, "");
}

function buildChatUrl(phoneNumber: string, message?: string): string {
  const waNumber = toChatNumber(phoneNumber);
  const base = `https://wa.me/${waNumber}`;

  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function ChatButton({ phoneNumber, message }: ChatButtonProps) {
  const href = buildChatUrl(phoneNumber, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0b3d91] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d91]/30"
      aria-label="Chat with us"
    >
      Chat with us
    </a>
  );
}
