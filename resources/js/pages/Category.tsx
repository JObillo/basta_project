import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CategoryModal from "../components/CategoryModal";
import AppLayout from "@/layouts/app-layout";
import {Toaster, toast} from "sonner";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Manage Category',
      href: '/category',
  },
];

type Category = {
    id: number;
    category_name: string;
  };
  

export default function Categorys() {
  const { category } = usePage<{ category: Category[] }>().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const openModal = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // if (!confirm("Are you sure you want to delete this book?")) return;
    router.delete(`/category/${id}`, {
      onSuccess: () => {
        toast.success("Category deleted successfully.");
        router.reload();
    },
      onError: () => {
        toast.success("Failed to Delete.");

        console.error("Failed to delete Category.")
    },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorys" />
      <Toaster position="top-right" richColors/>

      <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded">
        <div className="flex justify-end">
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition cursor-pointer"
          >
            Add Category
          </button>
        </div>

        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
          <thead>
            <tr className="bg-purple-900 text-white border-b">
              {[
                "Category ID",
                "Category Name",
                "Actions",
              ].map((header) => (
                <th key={header} className="border p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {category.length ? (
              category.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{category.id}</td>
                  <td className="p-3">{category.category_name}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openModal(category)}
                      className="bg-blue-500 text-sm text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-sm text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-600">
                  No Category found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </AppLayout>
  );
}
