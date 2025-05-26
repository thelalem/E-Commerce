import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initializeMockData } from '../../utils/initializeMockData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../utils/axios';

const AddProduct = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 1,
    image: null,
    previewImage: '',
  
  });
  const [errors, setErrors] = useState({});

  const categories = ['SUV', 'Sedan', 'Pickup'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          previewImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Product image is required';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 1) newErrors.stock = 'Stock must be at least 1';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try{
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', Number(formData.price));
      formPayload.append('category', formData.category);
      formPayload.append('stock', Number(formData.stock));
      formPayload.append('location', currentUser?.location || 'Addis Ababa');
      if (formData.image) {
        formPayload.append('image', formData.image);
      }
      await axiosClient.post('/products', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    toast.success('Product added successfully!');
    setTimeout(() => {
      navigate('/seller/dashboard');
    }, 2000);
    }catch (error) {
      // If backend sends an array of errors (common for validation)
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach(err => {
          toast.error(err.msg || err.message || JSON.stringify(err));
        });
      } 
      // If backend sends a single error message
      else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } 
      // Fallback
      else {
        toast.error('An error occurred while adding the product.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="1"
              value={formData.stock}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded-md ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-1 flex items-center">
            <div className="relative">
              {formData.previewImage ? (
                <img
                  src={formData.previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No image selected</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Choose Image
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/seller/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;