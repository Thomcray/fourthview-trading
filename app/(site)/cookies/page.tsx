import type { Metadata } from "next";
import Link from "next/link";
import { Cookie } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and browser storage used on the Fourth View Trading Company website.",
};

const LAST_UPDATED = "October 10, 2026";

type Row = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

const cookies: Row[] = [
  {
    name: "__Host-next-auth.csrf-token",
    provider: "First-party (NextAuth)",
    purpose: "Protects login and form submissions from forged requests.",
    duration: "Session",
  },
  {
    name: "__Secure-next-auth.callback-url",
    provider: "First-party (NextAuth)",
    purpose: "Returns you to the right page after you log in.",
    duration: "Session",
  },
  {
    name: "__Secure-next-auth.session-token",
    provider: "First-party (NextAuth)",
    purpose: "Keeps you logged in. Set only after you sign in.",
    duration: "Up to 30 days",
  },
];

const localStorageItems: Row[] = [
  {
    name: "nextauth.message",
    provider: "First-party (NextAuth)",
    purpose: "Keeps your login state in sync across browser tabs.",
    duration: "Until you clear your browser data",
  },
  {
    name: "preferredCurrency",
    provider: "First-party",
    purpose:
      "Remembers the currency you select so prices are shown in it on future visits. Only set if you choose a currency.",
    duration: "Until you clear your browser data",
  },
];

const paystackCookies: Row[] = [
  {
    name: "__cf_bm",
    provider: "Paystack (Cloudflare)",
    purpose: "Protects the payment process from bots and fraud.",
    duration: "30 minutes",
  },
  {
    name: "cf_clearance",
    provider: "Paystack (Cloudflare)",
    purpose: "Records that your browser passed a security check.",
    duration: "1 year",
  },
  {
    name: "AWSALBCORS",
    provider: "Paystack (Amazon Web Services)",
    purpose: "Keeps your payment session on the same server.",
    duration: "Up to 7 days",
  },
  {
    name: "ph_phc_…_posthog",
    provider: "Paystack (PostHog)",
    purpose: "Analytics used by Paystack on its payment pages.",
    duration: "1 year",
  },
];

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm text-gray-700">
        <thead>
          <tr className="border-b bg-gray-50 text-gray-900">
            <th className="p-3 font-semibold">Name</th>
            <th className="p-3 font-semibold">Provider</th>
            <th className="p-3 font-semibold">Purpose</th>
            <th className="p-3 font-semibold">Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.name}-${r.provider}`} className="border-b align-top">
              <td className="p-3 font-mono text-xs break-all">{r.name}</td>
              <td className="p-3">{r.provider}</td>
              <td className="p-3">{r.purpose}</td>
              <td className="p-3">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
          </FadeIn>
          <FadeIn
            delay={0.1}
            className="w-24 h-1 bg-blue-400 mx-auto rounded-full"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <FadeIn
          delay={0.2}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <div className="text-gray-700 leading-relaxed">
            <p className="text-sm text-gray-500 mb-6">
              Last updated: {LAST_UPDATED}
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              What are cookies?
            </h2>
            <p className="mb-8">
              Cookies are small text files stored on your device when you visit
              a website. Similar technologies, such as your browser&apos;s local
              storage, work in a comparable way. They help a website work, keep
              you signed in, and remember your choices.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              How we use them
            </h2>
            <p className="mb-4">
              On our own pages, Fourth View Trading Company uses only cookies
              and browser storage that are strictly necessary for our website to
              function, such as keeping you signed in and remembering the
              currency you choose. We do not use analytics or advertising
              cookies on our own pages, and we do not use cookies to track you
              across other websites.
            </p>
            <p className="mb-8">
              When you choose to pay, our payment provider, Paystack, loads its
              own payment form and may set its own cookies. These are listed
              below.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-2">
              Cookies set by our website
            </h2>
            <Table rows={cookies} />

            <h2 className="text-2xl font-bold text-blue-900 mt-10 mb-2">
              Local storage
            </h2>
            <Table rows={localStorageItems} />

            <h2 className="text-2xl font-bold text-blue-900 mt-10 mb-2">
              Cookies set by our payment provider
            </h2>
            <p className="mt-2">
              When you click Pay, we load Paystack&apos;s payment script and
              form. Paystack and its security providers may then set the cookies
              below. They are not set unless you start a payment, and we do not
              control them. See Paystack&apos;s own privacy and cookie
              information for details.
            </p>
            <Table rows={paystackCookies} />

            <h2 className="text-2xl font-bold text-blue-900 mt-10 mb-4">
              Location and currency
            </h2>
            <p className="mb-8">
              To show prices in a suitable currency, we use your approximate
              country, determined from your connection by our hosting provider.
              We do not store it on your device, and we do not use it for
              analytics or advertising. You can choose a different currency at
              any time.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Managing cookies in your browser
            </h2>
            <p className="mb-8">
              You can block or delete cookies and local storage through your
              browser settings. Doing so may stop parts of the site from
              working. For example, you may be signed out, your prices may reset
              to the default currency, or you may be unable to complete a
              payment.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Changes to this policy
            </h2>
            <p className="mb-8">
              If we start using other cookies, such as for analytics, we will
              update this page and ask for your consent where the law requires
              it.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              More information
            </h2>
            <p>
              For how we handle your personal data more generally, see our{" "}
              <Link href="/privacy" className="text-blue-700 underline">
                Privacy Policy
              </Link>
              . If you have questions about this page, please{" "}
              <Link href="/contact" className="text-blue-700 underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
