import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { usePage, Link } from "@inertiajs/react";
import { ListTodo, BarChart3, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || "User";

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span
                dangerouslySetInnerHTML={{
                  __html: "&#128075;",
                }}
              />
              Hai! {userName}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Apa yang ingin kamu lakukan hari ini?
            </p>
            <Link href="/todos">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                <ListTodo className="mr-2 h-5 w-5" />
                Kelola Todos
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border rounded-lg text-center">
              <ListTodo className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Kelola Aktivitas</h3>
              <p className="text-sm text-muted-foreground">
                Tambah, edit, dan hapus todos dengan mudah
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Tandai aktivitas yang sudah selesai
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-bold mb-2">Statistik</h3>
              <p className="text-sm text-muted-foreground">
                Lihat statistik produktivitas Anda
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}