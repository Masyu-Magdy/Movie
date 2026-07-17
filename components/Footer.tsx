"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Movie as MovieIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedIn,
  Language as Language,
} from "@mui/icons-material";

export default function Footer() {
  const footerLinks = {
    Browse: [
      { label: "Genres", href: "/genres" },
      { label: "Popular", href: "/popular" },
      { label: "Now Playing", href: "/nowplaying" },
      { label: "Trending", href: "/trending" },
      { label: "Top Rated", href: "/toprated" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: <GitHubIcon />,
      href: "https://github.com/Masyu-Magdy",
      label: "GitHub",
    },
    {
      icon: <LinkedIn />,
      href: "https://linkedin.com/in/masyu-magdy",
      label: "LinkedIn",
    },
    {
      icon: <Language />,
      href: "https://masyu-portfolio-sx7u.vercel.app/",
      label: "Portfolio",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link className="flex justify-center  gap-2 group" href="/">
              <motion.div
                className="flex items-center justify-center gap-2 group"
                whileHover={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <MovieIcon
                  className="text-[#E3A857] group-hover:text-[#F5C518] transition-colors"
                  sx={{ fontSize: 30 }}
                />
                <span className="font-display text-3xl bg-gradient-to-r from-[#E3A857] to-[#F5C518] bg-clip-text text-transparent">
                  Movie
                </span>
              </motion.div>
            </Link>

            <p className="mt-4 text-center  text-sm text-[var(--text-secondary)]  leading-relaxed">
              Discover, track, and share your favorite movies. The ultimate
              movie database for film enthusiasts.
            </p>

            <div className="mt-6 space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center justify-center gap-2">
                <LocationIcon
                  className="text-[#E3A857]"
                  sx={{ fontSize: 16 }}
                />
                <span>123 Movie Street, Hollywood, CA 90210</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <EmailIcon className="text-[#E3A857]" sx={{ fontSize: 16 }} />
                <span>movie@movie.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <PhoneIcon className="text-[#E3A857]" sx={{ fontSize: 16 }} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[#E3A857] hover:bg-[#E3A857]/10 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links], index) => (
            <div key={title}>
              <h3 className="text-center text-xl font-display font-semibold text-[var(--text-primary)] mb-4">
                {title}
              </h3>
              <ul className="space-y-3 text-center">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="footer-link text-md transition-colors duration-200 hover:scale-110 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
          <p>
            © {currentYear}{" "}
            <span className="text-[#E3A857] font-medium">Masyu Magdy</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="footer-link">
              Privacy
            </Link>
            <Link href="#" className="footer-link">
              Terms
            </Link>
            <Link href="#" className="footer-link">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
