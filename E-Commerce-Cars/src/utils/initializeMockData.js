import { mockProducts } from './mockProducts';

export const initializeMockData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(mockProducts));
  }
};

export const updateLocalStorage = (updatedProducts) => {
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};