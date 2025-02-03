export const GridSVG = () => (
  <svg
    className="z-1 pointer-events-none absolute inset-[unset] left-1/2 top-0 w-[1200px] -translate-x-1/2 text-neutral-300 [mask-image:radial-gradient(black,transparent)] max-sm:opacity-70"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern
        id="grid-:re:"
        x="-1"
        y="-19"
        width="80"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 80 0 L 0 0 0 80"
          fill="transparent"
          stroke="currentColor"
          stroke-width="1"
        ></path>
      </pattern>
    </defs>
    <rect fill="url(#grid-:re:)" width="100%" height="100%"></rect>
  </svg>
);
