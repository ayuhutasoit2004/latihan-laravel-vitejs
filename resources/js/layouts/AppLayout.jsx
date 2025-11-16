import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }) {
    const { url } = usePage();

    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/todos" className="text-lg font-bold">
  DelTodos
</Link>
                            
                            {/* Menu Navigasi */}
                           <div className="flex items-center space-x-4">
  <Link href="/" className="hover:underline">Home</Link>
  <Link href="/todos" className="hover:underline">Todos</Link>
</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card py-6 mt-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; 2025 Delcom Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}