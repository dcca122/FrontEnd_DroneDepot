import { NavLink } from 'react-router-dom';
import Container from './Container';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pilots', label: 'Pilots' },
  { to: '/concierge', label: 'Concierge' },
  { to: '/resources', label: 'Resources' },
  { to: '/request', label: 'Request Service' }
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <div className="flex items-center justify-between py-4">
          <NavLink to="/" className="text-xl font-bold text-brand-700">Drone Depot</NavLink>
          <nav className="hidden md:flex gap-6">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm hover:text-brand-700 ${isActive ? 'text-brand-700 font-medium' : 'text-slate-700'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
