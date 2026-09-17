export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            strokeWidth="58"
            d="M-150 176C180 56 430 296 700 166 1050 6 1120 96 1360 206"
          />
          <path
            strokeWidth="88"
            d="M-150 712C120 596 300 838 620 724 980 596 1010 636 1370 668"
          />
        </g>
      </svg>
    </div>
  );
}
