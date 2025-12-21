import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type = 'button', onClick, href, children, ...props }) => {
  const buttonStyles = "px-6 py-3 rounded-2xl font-medium transition-colors bg-primary hover:bg-primary/90 cursor-pointer text-black";

  if (type === 'link') {
    return (
      <a className={buttonStyles} href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonStyles} type={type} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset', 'link']),
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
