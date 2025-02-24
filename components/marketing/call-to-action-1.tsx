export default function CallToAction1() {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid items-center gap-8 sm:gap-20 lg:grid-cols-1">
          <div className="max-w-5xl">
            <h2 className="mb-4 text-4xl font-bold md:text-7xl">
              Streamline Your Invoicing Process
            </h2>
            <p className="mb-6 max-w-lg text-sm text-gray-500 sm:text-base md:mb-12">
              With a few clicks generate a PDF invoice or a link to a Tilly
              Billy invoice page where you can accept payment online.
            </p>
            <ul className="grid place-items-start gap-8 lg:grid-cols-3">
              {[
                "Customizable Invoice Templates",
                "Export to PDF or Email in One Click",
                "Tax Calculations Made Simple",
                "Automate Invoicing for Recurring Clients",
                "Manage Clients and Projects",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.41 4.93L6.64 9.54 5.38 8.18a.7.7 0 0 0-.87-.04.61.61 0 0 0-.18.8l1.5 2.45c.15.22.41.36.69.36.28 0 .53-.14.68-.36.24-.31 4.82-5.78 4.82-5.78.6-.6-.13-1.15-.6-.68z" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=375a1ea3-a8b6-4d63-b975-aac8d0174074"
              alt=""
              className="mx-auto inline-block h-full w-full max-w-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
