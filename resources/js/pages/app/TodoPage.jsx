import React, { useState, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";

export default function TodoPage() {
  const { todos, stats, filters, flash } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");
  const [filter, setFilter] = useState(filters.filter || "all");

  // SweetAlert untuk flash message
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: flash.success,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [flash]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/todos", { search, filter }, { preserveState: true });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    router.get("/todos", { search, filter: newFilter }, { preserveState: true });
  };

  const handleToggleFinish = (id) => {
    Swal.fire({
      title: "Ubah Status?",
      text: "Apakah Anda yakin ingin mengubah status todo ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(`/todos/${id}/toggle`);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Todo?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/todos/${id}`);
      }
    });
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.cover) {
      data.append("cover", formData.cover);
    }

    router.post("/todos", data, {
      onSuccess: () => {
        setShowAddModal(false);
        setFormData({ title: "", description: "", cover: null });
      },
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Todos</h1>
          <p className="text-muted-foreground">
            Kelola aktivitas dan rencana Anda
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Todos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.finished}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Belum Selesai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.unfinished}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Cari todo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
            >
              Semua
            </Button>
            <Button
              variant={filter === "finished" ? "default" : "outline"}
              onClick={() => handleFilterChange("finished")}
            >
              Selesai
            </Button>
            <Button
              variant={filter === "unfinished" ? "default" : "outline"}
              onClick={() => handleFilterChange("unfinished")}
            >
              Belum Selesai
            </Button>
          </div>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Todo
          </Button>
        </div>

        {/* Todo List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {todos.data.map((todo) => (
            <Card key={todo.id} className="overflow-hidden">
              {todo.cover && (
                <img
                  src={`/storage/${todo.cover}`}
                  alt={todo.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className={todo.is_finished ? "line-through" : ""}>
                    {todo.title}
                  </span>
                  {todo.is_finished ? (
                    <span className="text-green-600">
                      <Check className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-orange-600">
                      <X className="h-5 w-5" />
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {todo.description || "Tidak ada deskripsi"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleFinish(todo.id)}
                >
                  {todo.is_finished ? "Belum Selesai" : "Selesai"}
                </Button>
                <Link href={`/todos/${todo.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {todos.links && (
          <div className="flex justify-center gap-2">
            {todos.links.map((link, index) => (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                disabled={!link.url}
                onClick={() =>
                  link.url &&
                  router.get(link.url, { search, filter }, { preserveState: true })
                }
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}

        {/* Modal Tambah Todo */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Tambah Todo Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Judul
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      className="w-full border rounded-md p-2"
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover (Opsional)
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, cover: e.target.files[0] })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Simpan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}