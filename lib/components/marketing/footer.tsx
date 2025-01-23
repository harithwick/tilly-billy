import Link from "next/link";
export default function Footer() {
  return (
    <footer className="my-20">
      <p className="text-center text-sm text-slate-500">
        Copyright © 2025 Tilly Billy. All rights reserved.
      </p>{" "}
      <p className="text-center text-xs text-slate-500 mt-1">
        <Link
          href="https://github.com"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          GitHub
        </Link>
      </p>
    </footer>
  );
}
