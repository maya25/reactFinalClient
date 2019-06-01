import React from "react";

export default ({ children, onSubmit }) => {
  const _onSubmit = event => {
    event.preventDefault();
    if (typeof onSubmit === 'function') onSubmit(event);
  }

  return (
    <form className="site-form" onSubmit={_onSubmit}>
      {children}
    </form>
  );
}
