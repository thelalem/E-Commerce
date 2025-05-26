import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../utils/axios';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 1,
    image: null,
    location: '',
    previewImage: ''
  });
  const [errors, setErrors] = useState({});

  const categories = ['SUV', 'Sedan', 'Pickup'];

  useEffect(() => {
  const fetchProduct = async () => {
    try{
      const res = await axiosClient.get(`/products/${id}`);
      const product = res.data;

      console.log('product.seller:', product.seller);
      console.log('currentUser:', currentUser);

      const sellerId = product.seller?._id || product.seller?.id || product.seller;
      const userId =  currentUser._id || currentUser.id;

      if(String(sellerId) !== String(userId)) {
        console.log('Redirecting to dashboard: Unauthorized access'); // Log unauthorized access
        navigate('/seller/dashboard');
        return;
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',	
        category: product.category || '',
        location: product.location || '',
        stock: product.stock || 1,
        image: null, 
        previewImage: product.image || ''
      });
    }catch (error) {
      toast.error('Product not found');
      navigate('/seller/dashboard');
    }
  }
  if (id && currentUser) fetchProduct();

  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
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
    if (!formData.location) newErrors.location = 'Location is required';
    if(!formData.stock || isNaN(formData.stock) || formData.stock < 1) {
      newErrors.stock = 'Stock must be a positive number';
    }
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
      formPayload.append('price', formData.price);
      formPayload.append('category', formData.category);
      formPayload.append('stock', formData.stock);
      formPayload.append('location', formData.location);
      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      const res = await axiosClient.put(`/products/${id}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Product updated:', res.data);
      toast.success('Product updated successfully');
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 1000);

    }catch (error) {
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg || err.message || JSON.stringify(err));
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
              errors.name ? 'border-red-500' : ''
            }`}
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETB)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                errors.price ? 'border-red-500' : ''
              }`}
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                  errors.location ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select a location</option>
                <option value="Adama">Adama</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="1"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                errors.stock ? 'border-red-500' : ''
              }`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-1 flex items-center">
            {formData.previewImage ? (
              <img
                src={formData.previewImage}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md"
              />
            ) : (
              <div className="h-32 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div className="ml-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Image
              </label>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/seller/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;