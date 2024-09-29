export default function Footer() {
  const date = new Date();
  let year = date.getFullYear();

  return (
    <>
      <footer className="relative border-t border-white/10">
        <div className="flex items-center justify-between mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="flex items-center">
            {/* <a
              href="https://www.instagram.com/flightlevel.fyi"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const newTab = window.open(
                  "https://www.instagram.com/flightlevel.fyi",
                  "_blank"
                );
                if (newTab) {
                  newTab.focus();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5.5 h-5.5 text-gray-400 hover:text-gray-300"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a> */}
          </div>
          <p className="text-xs leading-5 text-gray-400 text-center">
            © {year} PrepMe. All rights reserved
          </p>
          <div></div>{" "}
          {/* This empty div helps in keeping the Instagram icon at the far left */}
        </div>
      </footer>
    </>
  );
}
