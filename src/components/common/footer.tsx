"use client";

import React from "react";

const footer = () => {
  const links = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <footer className="w-full bg-secondary/50 text-foreground py-6 mt-16 h-fit rounded-t-2xl">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="relative group text-lg transition-colors duration-300 hover:text-primary"
          >
            {link.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        &copy; {new Date().getFullYear()} Secret Box. All rights reserved.
      </p>
    </footer>
  );
};

export default footer;
