import React, { useState } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function TodoEditPage() {
  const { todo } = usePage().props;
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description || "",
  });
  const [coverFile, setCoverFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("_method", "PUT");

    router.post(`/todos/${todo.id}`, data);
  };

  const handleCoverUpdate = (e) => {
    e.preventDefault();
    if (!coverFile) return;

    const data = new FormData();
    data.append("cover", coverFile);

    router.post(`/todos/${todo.id}/cover`, data, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Cover berhasil diperbarui",
          timer: 2000,
        });
        setCoverFile(null);
      },
    });
  };

  const handleDeleteCover = () => {
    Swal.fire({
      title: "Hapus Cover?",
      text: "Cover akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/todos/${todo.id}/cover`);
      }
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/todos">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Todo</h1>
          </div>

          {/* Form Edit */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informasi Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Judul <span className="text-red-600">*</span>
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
                    className="w-full border rounded-md p-2 min-h-[120px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tuliskan deskripsi todo..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Kelola Cover */}
          <Card>
            <CardHeader>
              <CardTitle>Kelola Cover</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cover Saat Ini */}
              {todo.cover && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Saat Ini
                  </label>
                  <div className="relative">
                    <img
                      src={`/storage/${todo.cover}`}
                      alt={todo.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleDeleteCover}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Cover
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Cover Baru */}
              <form onSubmit={handleCoverUpdate}>
                <label className="block text-sm font-medium mb-2">
                  {todo.cover ? "Upload Cover Baru" : "Upload Cover"}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!coverFile}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {coverFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    File dipilih: {coverFile.name}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}