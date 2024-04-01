import styles from '../styles/tailwind.css';

export const Hero = () => {
  return (
    <div className="full-screen-bg h-screen w-screen">
      <div className="flex justify-left items-center h-screen">
        <div className="ml-16 w-[35rem] flex flex-col space-y-10">
          <h1 className="text-white font-bold text-8xl">
            Redefining your soap.
          </h1>
          <p className="font-semibold text-white">
            Introducing a soap that will take you away from shower gel...
          </p>
          <div className="flex space-x-4">
            <a href="/get-started">
              <button className="bg-sky-950 py-3 px-8 border border-white rounded-lg text-white flex space-x-3">
                <h1>Shop Now</h1>
                <span>
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
                    className="lucide lucide-arrow-right-circle"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="m12 16 4-4-4-4"></path>
                  </svg>
                </span>
              </button>
            </a>
            <button className="text-sky-950 py-3 px-8 border border-white rounded-lg bg-white flex space-x-3">
              <h1>Learn More</h1>
              <span>
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
                  className="lucide lucide-arrow-right-circle"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12h8"></path>
                  <path d="m12 16 4-4-4-4"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
