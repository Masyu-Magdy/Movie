"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Movie as MovieIcon,
  Bookmark as BookmarkIcon,
  Category as CategoryIcon,
  Whatshot as WhatshotIcon,
  Stars as StarsIcon,
  PlayCircle as PlayCircleIcon,
  TrendingUp as TrendingUpIcon,
  Login as LoginIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Typography,
} from "@mui/material";
import SearchBar from "./SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    router.push("/");
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMobileSearchOpen]);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-red-500 to-red-600",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-orange-500 to-orange-600",
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <HomeIcon /> },
    { href: "/genres", label: "Genres", icon: <CategoryIcon /> },
    { href: "/popular", label: "Popular", icon: <WhatshotIcon /> },
    { href: "/nowplaying", label: "Now Playing", icon: <PlayCircleIcon /> },
    { href: "/trending", label: "Trending Now", icon: <TrendingUpIcon /> },
    { href: "/toprated", label: "Top Rated", icon: <StarsIcon /> },
    { href: "/watchlist", label: "Watchlist", icon: <BookmarkIcon /> },
  ];
  const drawerLinks = [
    { href: "/", label: "Home", icon: <HomeIcon /> },
    { href: "/genres", label: "Genres", icon: <CategoryIcon /> },
    { href: "/popular", label: "Popular", icon: <WhatshotIcon /> },
    { href: "/nowplaying", label: "Now Playing", icon: <PlayCircleIcon /> },
    { href: "/trending", label: "Trending Now", icon: <TrendingUpIcon /> },
    { href: "/toprated", label: "Top Rated", icon: < StarsIcon/> },
    { href: "/watchlist", label: "Watchlist", icon: <BookmarkIcon /> },
    ...(isAuthenticated
      ? [{ href: "/profile", label: "Profile", icon: <PersonIcon /> }]
      : []),
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/50 dark:bg-[#0B0F1A]/50 backdrop-blur-lg shadow-xl dark:border-[#E3A857]/10"
            : "bg-white/10 dark:bg-[#0B0F1A]/15"
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                href="/"
                className="font-display font-semibold text-3xl tracking-widest text-[#E3A857] hover:text-[#F5C518] transition-colors flex items-center gap-2 group"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <MovieIcon
                    sx={{ fontSize: 30 }}
                    className="text-[#E3A857] group-hover:text-[#F5C518] transition-colors"
                  />
                </motion.div>
                <span className="sm:inline bg-gradient-to-r from-[#E3A857] to-[#F5C518] bg-clip-text text-transparent">
                  Movie
                </span>

              </Link>
            </motion.div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <motion.div
                className="relative"
                animate={{ scale: searchFocused ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <SearchBar
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </motion.div>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <IconButton
                  onClick={toggleMobileSearch}
                  color="primary"
                  className={`text-[#E3A857] hover:bg-[#E3A857]/10 transition-colors ${
                    isMobileSearchOpen ? "bg-[#E3A857]/20" : ""
                  }`}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={toggleTheme}
                  className="text-gray-900 dark:text-[#eee] hover:text-[#E3A857] transition-colors"
                >
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </motion.div>

              <div className="hidden md:flex items-center ">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-base font-semibold transition-colors group ${
                        isActive(link.href)
                          ? "text-[#E3A857] font-semibold"
                          : "text-gray-900 dark:text-[#ffffff] hover:text-[#E3A857]"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E3A857] to-[#F5C518] transition-transform origin-left ${
                          isActive(link.href)
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAuthenticated ? (
                  <IconButton
                    onClick={handleMenuOpen}
                    className="ml-2 border-2  border-[#E3A857]/30 hover:border-[#E3A857] transition-colors relative group"
                  >
                    <Avatar
                      src={user?.avatar_url || undefined}
                      alt={user?.name || "User"}
                      className={`w-9 h-9 bg-gradient-to-r ${getAvatarColor(
                        user?.name || "",
                      )} text-white font-bold transition-all duration-300 group-hover:scale-105`}
                    >
                      {getInitials(user?.name || "")}
                    </Avatar>
                  </IconButton>
                ) : (
                  <Link
                    href="/login"
                    className="ml-2 px-4 py-2 rounded-full bg-[#E3A857] text-white dark:text-[#0B0F1A] text-md font-medium hover:bg-[#F5C518] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <IconButton
                  onClick={toggleDrawer(true)}
                  className="text-[#E3A857] hover:bg-[#E3A857]/10"
                >
                  <MenuIcon className="text-[#E3A857] hover:bg-[#E3A857]/10" />
                </IconButton>
              </motion.div>
            </div>
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              className:
                "mt-2 min-w-[280px] max-w-[320px] bg-white dark:bg-[#0B0F1A]/95 backdrop-blur-xl border border-gray-200 dark:border-[#E3A857]/20 shadow-2xl rounded-xl overflow-hidden",
            },
          }}
        >
          {isAuthenticated && user && (
            <>
              <div className="px-4 py-3 bg-gradient-to-r  ">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user?.avatar_url || undefined}
                    alt={user?.name || "User"}
                    className={`w-12 h-12 bg-gradient-to-r ${getAvatarColor(
                      user?.name || "",
                    )} text-white font-bold text-lg`}
                  >
                    {getInitials(user?.name || "")}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-gray-800 dark:text-gray-200 truncate"
                    >
                      {user?.name || "User"}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-500 dark:text-gray-400 truncate block"
                    >
                      {user?.email || "user@email.com"}
                    </Typography>
                  </div>
                </div>
              </div>

              <Divider className="bg-gray-200 dark:bg-[#E3A857]/20" />

              <div className="py-3">
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push("/profile");
                  }}
                  sx={{ marginBottom: 1 }}
                  className="text-gray-700 dark:text-gray-300 dark:hover:text-yellow-600 dark:hover:bg-gray-900   hover:text-[#E3A857] transition-colors mx-2 rounded-lg"
                >
                  <ListItemIcon className=" min-w-[36px]">
                    <PersonIcon className="text-[#E3A857]" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <span className="font-medium">My Profile</span>
                    <span className="block text-xs text-gray-300 dark:text-[#8B92A5]/60">
                      View and edit your profile
                    </span>
                  </ListItemText>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    router.push("/watchlist");
                  }}
                  className="text-gray-700 dark:text-gray-300 dark:hover:text-yellow-600 dark:hover:bg-gray-900   hover:text-[#E3A857] transition-colors mx-2 rounded-lg"
                >
                  <ListItemIcon className=" min-w-[36px]">
                    <BookmarkIcon className="text-[#E3A857]" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <span className="font-medium">My Watchlist</span>
                    <span className="block text-xs text-gray-400 dark:text-[#8B92A5]/60">
                      Your saved movies
                    </span>
                  </ListItemText>
                </MenuItem>
              </div>

              <Divider className="bg-gray-200 dark:bg-[#E3A857]/20" />

              <div className="py-1">
                <MenuItem
                  onClick={handleLogout}
                  className="text-red-500 dark:text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mx-2 rounded-lg"
                >
                  <ListItemIcon className=" min-w-[36px]">
                    <LogoutIcon className="text-red-500" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <span className="font-medium">Sign Out</span>
                    <span className="block text-xs text-red-400/60">
                      Logout from your account
                    </span>
                  </ListItemText>
                </MenuItem>
              </div>
            </>
          )}
        </Menu>
      </motion.header>

      <AnimatePresence>
        {isMobile && isMobileSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSearchOpen(false)}
              className="fixed inset-0 z-40 bg-black/200 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 px-4 py-4 dark:bg-[#0B0F1A]/98 backdrop-blur-xl border-b border-gray-200 dark:border-[#E3A857]/20 md:hidden"
            >
              <div className="flex items-center gap-3">
                <IconButton
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="text-gray-600 dark:text-[#E3A857] hover:bg-gray-100 dark:hover:bg-[#E3A857]/10"
                >
                  <CloseIcon />
                </IconButton>
                <div className="flex-1">
                  <SearchBar
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            className:
              "w-[300px] bg-white dark:bg-[#0B0F1A]/50 backdrop-blur-xl border-l border-gray-200 dark:border-[#E3A857]/20",
          },
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#E3A857]/20">
          <span className="font-display text-2xl text-[#E3A857]">MOVIE</span>
          <IconButton
            onClick={toggleDrawer(false)}
            className="text-gray-600 dark:text-[#E3A857] hover:bg-gray-100 dark:hover:bg-[#E3A857]/10"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {isAuthenticated && user && (
          <div className="p-4 border-b border-gray-200 dark:border-[#E3A857]/20">
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar_url || undefined}
                alt={user?.name || "User"}
                className={`w-12 h-12 bg-gradient-to-r ${getAvatarColor(
                  user?.name || "",
                )} text-white font-bold`}
              >
                {getInitials(user?.name || "")}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-[#8B92A5] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <List className="p-4">
          {drawerLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                component={Link}
                href={link.href}
                onClick={toggleDrawer(false)}
                className={`rounded-lg transition-all duration-200 mb-1 ${
                  isActive(link.href)
                    ? "bg-[#E3A857]/10 text-[#E3A857]"
                    : "text-gray-600 dark:text-[#8B92A5] hover:bg-[#E3A857]/10 hover:text-[#E3A857]"
                }`}
              >
                <ListItemIcon sx={{ color: "#E3A857" }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            </motion.div>
          ))}

          {isAuthenticated && (
            <>
              <Divider className="my-2 bg-gray-200 dark:bg-[#E3A857]/20" />
              <ListItem
                onClick={() => {
                  toggleDrawer(false)();
                  handleLogout();
                }}
                className="rounded-lg transition-all duration-200 mb-1 text-red-500 hover:bg-red-500/10 cursor-pointer"
              >
                <ListItemIcon sx={{ color: "red" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
