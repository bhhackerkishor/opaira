"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { useUI } from "@/context/UIContext";

  

  
const Navbar = () => {
  const { data: session }: any = useSession();
  const { showNavbar } = useUI();
 
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
 

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true); // hide when scrolling down
      } else {
        setHidden(false); // show when scrolling up
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  if (!showNavbar) return null; // 👈 hide navbar when false

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-transform duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } bg-white/80 backdrop-blur-md shadow-sm`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-4 lg:px-8"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1 items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo 1.png"
                width={60}
                height={60}
                alt="Opaira logo"
                className="rounded-full"
              />
              <span className="text-lg font-bold text-yellow-600">
                Opaira
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-x-4">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-900 hover:text-yellow-600"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-yellow-500 bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-900 hover:text-yellow-600"
                >
                  Log out
                </button>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-64 bg-white px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo 1.png"
                  width={40}
                  height={40}
                  alt="Opaira logo"
                />
                <span className="text-lg font-bold text-yellow-600">
                  Opaira
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FaXmark className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {session && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              {!session ? (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-100 hover:text-yellow-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-lg px-3 py-2 text-base font-semibold bg-yellow-500 text-white text-center hover:bg-yellow-600 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-base font-semibold text-center text-gray-900 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                >
                  Log out
                </button>
              )}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
};

export default Navbar;
