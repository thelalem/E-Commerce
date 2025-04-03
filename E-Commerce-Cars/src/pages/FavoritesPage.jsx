import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Favorite Cars</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">You haven't saved any favorites yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;