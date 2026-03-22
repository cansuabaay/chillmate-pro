/**
 * Simple dashboard navigation — only when the user has finished setup.
 */
export default function NavBar({ active, onNavigate, firstName }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'daily', label: 'Daily check' },
    { id: 'weekly', label: 'Weekly insights' },
    { id: 'history', label: 'History' },
  ]

  return (
    <nav className="app-nav" aria-label="Main">
      <div className="app-nav__brand">
        <span className="logo-mark" aria-hidden="true" />
        <span className="logo-text">ChillMate Pro</span>
      </div>
      {firstName ? <span className="app-nav__hi">Hi, {firstName}</span> : null}
      <ul className="app-nav__links">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`app-nav__btn ${active === item.id ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
