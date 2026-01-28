"use client";

import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, User, List, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useSession, signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: List },
    { name: "Themes", href: "/admin/theme", icon: Palette },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // 👇 FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); 
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-[#1A1A1A]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
          
          {/* Logo Area */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">TYAARA <br/><span className="text-gray-400 text-lg">ADMIN</span></h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
                    ${isActive 
                      ? "bg-[#1A1A1A] text-white shadow-md" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]" 
                    }
                  `}
                >
                  <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section: User & Logout */}
          <div className="p-4 border-t border-gray-200">
            {session ? (
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        {/* Show First Initial */}
                        <span className="font-bold text-xs">{session.user?.name?.[0]?.toUpperCase() || <User size={16} />}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                        </p>
                    </div>
                </div>
            ) : null}

            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors text-sm font-medium cursor-pointer"
            >
                <LogOut size={18} />
                Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}