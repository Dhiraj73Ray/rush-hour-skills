/**
 * src/components/Header.jsx
 * ------------------------------------------------------------------
 * Default header for <StackLayout />.
 * Override via slots.header if you want your own.
 * ------------------------------------------------------------------
 */

import './Header.css';

export function Header({ title, subtitle }) {
  if (!title && !subtitle) return null;

  return (
    <header className="rhs-header">
      {title && <h1 className="rhs-title">{title}</h1>}
      {subtitle && <p className="rhs-subtitle">{subtitle}</p>}
    </header>
  );
}

export default Header;