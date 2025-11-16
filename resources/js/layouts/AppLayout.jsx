import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }) {
  const { auth } = usePage().props;
  
  const onLogout = () => {
    router.get("/auth/logout");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-lg font-bold">
                DelTodos
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    Home
                  </Button>
                </Link>
                <Link href="/todos">
                  <Button variant="ghost" size="sm">
                    Todos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {auth?.user && (
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {auth.user.name}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2025 Delcom Labs. All rights reserved.
        </div>
      </footer>
    </div>
  );
}