import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Invoice Not Found</h1>
        <p className="text-gray-600 mb-6">
          The invoice you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
