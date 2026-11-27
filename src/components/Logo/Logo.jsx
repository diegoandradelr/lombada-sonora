export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg className="size-12 shrink-0" aria-hidden="true" viewBox="0 0 48 48">
        <rect x="5" y="15" width="9" height="26" rx="1.5" fill="#4e6b55" />
        <circle
          cx="24"
          cy="27"
          r="11"
          fill="#1f2a22"
          stroke="#f3e6d6"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <circle
          cx="24"
          cy="27"
          r="7.5"
          fill="none"
          stroke="#3a4a3e"
          strokeWidth="1"
        />
        <circle cx="24" cy="27" r="3.8" fill="#b9531f" />
        <circle cx="24" cy="27" r="0.9" fill="#1f2a22" />
        <rect x="34" y="12" width="9" height="29" rx="1.5" fill="#2e4a5e" />
        <rect x="3" y="41" width="42" height="4" rx="1" fill="#9b6a43" />
      </svg>
      <p className="font-display text-2xl font-bold">
        Lombada <span className="text-ember">Sonora</span>
      </p>
    </div>
  );
};
