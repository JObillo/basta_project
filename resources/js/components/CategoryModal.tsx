import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

interface Category {
  id?: number;
  category_name: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  category?: Category | null;
}

export default function CategoryModal({ isOpen, closeModal, category }: Props) {
  const [formData, setFormData] = useState<Category>({
    category_name: "",
  });


  // Set initial form data and preview when the category is passed
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          category_name: category.category_name,
        });
      } else {
        setFormData({
          category_name: "",
        });
      }
    }
  }, [isOpen, category]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically set the input's name and value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category_name", formData.category_name);

    //Toast Notifications
    const successMessage = category?.id
      ? "Category updated successfully."
      : "Category Added successfully.";
    const errorMessage = category?.id
      ? "Failed to update Category."
      : "Failed to Add Category.";

    if (category?.id) {
      data.append("_method", "PUT"); // Method override for update
      router.post(`/category/${category.id}`, data, {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: (errors) => {
          toast.error(errorMessage);
          console.error(errors.message || "Failed to submit Category.");
        },
      });
    } else {
      router.post("/category", data, {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: (errors) => {
          toast.error(errorMessage);
          console.error(errors.message || "Failed to submit Category.");
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center border border-black rounded-lg overflow-y-auto bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg rounded-lg border-3 border-gray-600 shadow w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Category Name */}
          <div className="mb-3">
            <label className="block text-black font-medium">Category Name</label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange} // Added handleChange here
              className="w-full border rounded p-2 text-black"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              {category ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
