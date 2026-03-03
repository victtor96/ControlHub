import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [navbarColor, setNavbarColor] = useState('default-color');

  const toggleMenu = () => setMenuActive((prev) => !prev);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setScrollingDown(currentScrollY > lastScrollY);
    setLastScrollY(currentScrollY);
  };

  const updateNavbarColor = (color) => setNavbarColor(color);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`${scrollingDown ? 'hidden' : ''} ${menuActive ? 'active' : ''} ${navbarColor}`}>
      <button
        className={`navbar-toggle ${menuActive ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-expanded={menuActive}
        aria-label="Toggle navigation menu"
      >
        <div />
        <div />
        <div />
      </button>
      <ul className={menuActive ? 'active' : ''}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link home-link ${isActive ? 'active-link' : ''}`}
            onClick={() => updateNavbarColor('home-color')}
          >
            PTZ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link about-link ${isActive ? 'active-link' : ''}`}
            onClick={() => updateNavbarColor('about-color')}
          >
            VMIX
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) => `nav-link services-link ${isActive ? 'active-link' : ''}`}
            onClick={() => updateNavbarColor('services-color')}
          >
            VMIX + PTZ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
