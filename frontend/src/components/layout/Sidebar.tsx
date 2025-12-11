import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">micro-observer</div>
      <nav className="sidebar__nav">
        <NavLink to="/dashboard" className="sidebar__link">
          Dashboard
        </NavLink>
        <NavLink to="/alerts" className="sidebar__link">
          Alerts
        </NavLink>
        <NavLink to="/settings" className="sidebar__link">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
