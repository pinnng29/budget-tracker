import { UserButton } from "@clerk/nextjs";

import Logo from "@/components/logo";
import Navigation from "@/components/navigation";
import ThemeSwitcher from "@/components/theme-switcher";


export default function Navbar() {
  return (
    <nav className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-10 border-b shadow-sm">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center lg:gap-x-16">
          <Logo />
          <Navigation />
        </div>
        <div className="flex items-center gap-x-2">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
