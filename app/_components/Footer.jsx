import React from "react";
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

function Footer() {
  const email = "zeremiahdelacruz@gmail.com";

  return (
    <footer className="bg-white border-t mt-24 py-8 md:py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo and description */}
          <div className="md:max-w-xs">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              <span className="font-bold text-brand-primary">DeepLogo AI</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Create beautiful, unique logos for your business or project in
              seconds using our AI-powered logo generator.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Create Logo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
            <p className="text-sm text-gray-600 mb-3">
              Have questions or need help?
            </p>

            {/* Social links with simple SVG icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-gray-600 hover:text-brand-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              <Link
                href={`mailto:${email}`}
                className="text-gray-600 hover:text-brand-primary relative group"
                aria-label="Send Email"
              >
                <Mail className="h-5 w-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Send Email
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} DeepLogo AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
