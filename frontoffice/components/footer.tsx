import Link from "next/link";

import { siteConfig } from "../types/index";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t bg-nav-bg text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-10 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {siteConfig.footer.map((item) => (
            <div key={item.name} className="pb-6">
              <Link href={item.href} className="text-lg font-bold leading-6">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-center mt-5">
          <div className="block text-center text-base leading-5">
            <Link
              href="https://localhost:2000/"
              className="ml-auto"
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={250}
                height={250}
                className="rounded-full mx-auto mb-4"
              />
              &copy; {new Date().getFullYear()} {siteConfig.name} LLC. All
              rights reserved.
            </Link>
          </div>
          <div className="ml-auto">
            <Image
              src="/images/social.png"
              alt="Social"
              width={390}
              height={390}
              className="rounded-full mx-auto mb-4"
            />
          </div>
          <div className="ml-auto">
            <Image
              src="/images/qrplaystore.png"
              alt="App"
              width={200}
              height={200}
              className="mb-5"
            />
            <h3 className="text-center">New Mobile App</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}
