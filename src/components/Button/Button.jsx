import React from 'react';
import PropTypes from 'prop-types';

const SIZES = {
  small: 'px-4 py-2',
  medium: 'px-6 py-3',
  large: 'px-8 py-4',
}

const Button = ({ type = 'button', onClick, href, children, className = '', disabled = false, size = "medium", ...props }) => {
  const buttonStyles = `${SIZES[size]} ${
    disabled
      ? 'bg-primary/50 cursor-not-allowed'
      : 'bg-primary hover:bg-primary/90 cursor-pointer'
  } rounded-2xl font-medium transition-colors text-black ${className}`;

  if (type === 'link') {
    return (
      <a
        className={buttonStyles}
        href={href}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={buttonStyles}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset', 'link']),
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
