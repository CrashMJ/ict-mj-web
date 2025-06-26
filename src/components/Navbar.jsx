import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sectionOffsets = links.map(link => {
        const el = document.querySelector(link.href);
        return {
          href: link.href,
          offset: el?.offsetTop || 0,
        };
      });

      const scrollPos = window.scrollY + 100;
      const current = sectionOffsets.reverse().find(s => scrollPos >= s.offset);
      if (current) setActiveLink(current.href);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const links = [
    { href: '#home', label: 'Home' },
    { href: '#work', label: 'Work Process' },
    { href: '#paper', label: 'Paper' },
    { href: '#telegram', label: 'Telegram' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#about', label: 'About' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleClick = (href) => {
    setActiveLink(href);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md text-black' : 'bg-transparent text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">ict.lk</h1>
        <ul className="hidden md:flex gap-6">
          {links.map((link, i) => (
            <li key={i}>
              <button
                onClick={() => handleClick(link.href)}
                className={`transition hover:text-yellow-400 ${activeLink === link.href ? 'text-yellow-400 font-semibold' : ''}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="md:hidden">
          <button className="focus:outline-none">☰</button>
        </div>
      </div>
    </nav>
  );
}
