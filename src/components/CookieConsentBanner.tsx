"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentChoice = "accepted" | "rejected";

type GtagConsentState = {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "cookie_consent";

function logConsentDebug(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`[CookieConsent] ${message}`, payload ?? {});
}

const GRANTED_CONSENT: GtagConsentState = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

const DENIED_CONSENT: GtagConsentState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

function setConsentCookie(choice: ConsentChoice): void {
  document.cookie = `${STORAGE_KEY}=${choice}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function getConsentFromCookie(): ConsentChoice | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STORAGE_KEY}=`));

  if (!cookie) return null;
  const value = cookie.split("=")[1];
  return value === "accepted" || value === "rejected" ? value : null;
}

function getPersistedConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const localValue = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (localValue === "accepted" || localValue === "rejected") {
      return localValue;
    }
  } catch {
    // Ignore localStorage failures and fall back to cookie.
  }

  return getConsentFromCookie();
}

function updateGoogleConsent(choice: ConsentChoice): void {
  if (!window.gtag) return;

  try {
    window.gtag("consent", "update", choice === "accepted" ? GRANTED_CONSENT : DENIED_CONSENT);
  } catch {
    // Ignore gtag runtime failures to avoid blocking consent UI behavior.
  }
}

export function CookieConsentBanner({
  initialConsentChoice = null,
}: {
  initialConsentChoice?: ConsentChoice | null;
}) {
  const [choiceOverride, setChoiceOverride] = useState<ConsentChoice | null>(null);

  const consentChoice = choiceOverride ?? initialConsentChoice ?? getPersistedConsentChoice();

  useEffect(() => {
    logConsentDebug("Current consent value on render", {
      initialConsentChoice,
      choiceOverride,
      resolvedConsentChoice: consentChoice,
      localStorageConsent:
        typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null,
      cookieConsent:
        typeof document !== "undefined"
          ? document.cookie
              .split(";")
              .map((part) => part.trim())
              .find((part) => part.startsWith(`${STORAGE_KEY}=`)) ?? null
          : null,
    });
  }, [choiceOverride, consentChoice, initialConsentChoice]);

  useEffect(() => {
    if (!consentChoice) return;
    updateGoogleConsent(consentChoice);
  }, [consentChoice]);

  const handleChoice = (choice: ConsentChoice) => {
    // Hide banner immediately even if storage/gtag are blocked in the browser.
    setChoiceOverride(choice);
    logConsentDebug("Accept/Reject clicked", { choice });

    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore storage failures and continue with runtime consent update.
    }

    setConsentCookie(choice);
    updateGoogleConsent(choice);

    logConsentDebug("Value after clicking choice", {
      choice,
      localStorageConsent:
        typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null,
      cookieConsent:
        typeof document !== "undefined"
          ? document.cookie
              .split(";")
              .map((part) => part.trim())
              .find((part) => part.startsWith(`${STORAGE_KEY}=`)) ?? null
          : null,
    });
  };

  if (consentChoice) return null;

  return (
    <div id="cookie-consent-banner" className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0b1f3a]">Your privacy choices</p>
          <p className="mt-1 text-sm leading-6 text-black/75">
            We use analytics cookies to understand website performance and improve services.
            You can accept or reject non-essential cookies.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/consent/rejected"
            data-cookie-choice="rejected"
            onClick={(event) => {
              event.preventDefault();
              handleChoice("rejected");
            }}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium text-black/75 hover:bg-black/5"
          >
            Reject
          </Link>
          <Link
            href="/consent/accepted"
            data-cookie-choice="accepted"
            onClick={(event) => {
              event.preventDefault();
              handleChoice("accepted");
            }}
            className="rounded-md bg-[#0b1f3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#112d55]"
          >
            Accept
          </Link>
        </div>
      </div>
    </div>
  );
}
