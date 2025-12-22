import React from 'react';

const Input = ({ className, type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={`w-full max-w-[500px] h-[50px] bg-[#131516] px-4 py-2 border border-[#2c2f33] 
        bg-white dark:bg-dark text-black dark:text-white
        rounded-2xl text-medium tracking-wide focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;
