import { createUser } from "@/app/_lib/actions/user-actions";
import Link from "next/link";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token;

  const verifyToken = await createUser(token);

  if (!verifyToken?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
          <p className="text-gray-700">{verifyToken?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
        <p className="text-gray-700">
          Your email has been successfully verified!
        </p>

        <div className="mt-6">
          <Link
            href="/signin"
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
