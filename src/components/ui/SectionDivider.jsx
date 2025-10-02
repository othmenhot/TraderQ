import React from 'react';

const SectionDivider = () => {
  return (
    <div className="relative -mt-1 w-full h-16 sm:h-20 md:h-24 lg:h-32 text-background">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.3-37.31 70.3-4.01 136.33 19.32 206.3 37.31 70.36 17.98 136.33 24.38 206.3 6.38 70.3-18.01 136.33-44.31 206.3-37.31 70.36 6.99 136.33 32.17 158 28V0H0z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
