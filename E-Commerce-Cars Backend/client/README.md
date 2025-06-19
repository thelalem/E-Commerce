1. Project Overview
   Concept

The project is a Single Page Application (SPA) for an e-commerce platform focused on selling vehicles. It provides a seamless and interactive user experience for buyers and sellers, allowing them to browse, manage, and interact with products in real-time.

    Selected Product

The platform is scoped to vehicles, including categories such as SUVs, Sedans, and Pickup Trucks. The mock data includes a variety of vehicles with details such as price, location, description, and seller information.

    Features

    Buyer Features:
        - Browse products by category, price, and location.
        - View detailed product information.
        - Add products to a shopping cart (user-specific).
        - Save favorite products (user-specific).
        - Send messages to sellers.

    Seller Features:
        - Secure login to a seller dashboard.
        - Add, edit, and delete products.
        - View and respond to buyer messages.

    Core Features:
        - Responsive design for mobile and desktop.
        - User-specific cart and favorites functionality.
        - Messaging system between buyers and sellers.
        - Mock data for products and users.

2.  How to Run the Project Locally

    Prerequisites
    Node.js (v16 or later)
    npm or yarn package manager

    Steps
    2.1 Clone the Repository: - git clone https://github.com/thelalem/E-Commerce.git
    Navigate to the folder - cd E-Commerce-Cars

    2.2 Install Dependencies
    -npm install

    2.3 Run the development Server

    -npm run dev

    2.4 Open the Application

    - open your browser and navigate to http://localhost:5173

3.  Description of How ES6+ Features Were Utilized
    The project leverages modern JavaScript (ES6+) features to enhance code readability, maintainability, and performance. Below are some examples:

        3.1. Destructuring Assignment
        - Used to extract values from objects and arrays.
        Example:
            const { currentUser } = useAuth();
            const { cartItems, addToCart } = useCart();
        3.2. Template Literals
        - Used for dynamic string interpolation.
        Example:
            const cartKey = `cart_${currentUser.id}`;

        3.3 Arrow Functions
        - Used for concise function expressions.
        - Example:
            const handleFavoriteClick = (e) => {
                e.stopPropagation();
                if (!currentUser) {
                    navigate('/login');
                    return;
                }
                addToFavorites(product);
            };

        3.4 Spread and Rest Operators
        - Used for copying and merging objects or arrays
        - Example:
            setFavorites((prevFavorites) => [...prevFavorites, product]);

        3.5 Modules (Import/Export)
        - Used to organize the codebase into reusable modules
        - Example:
            import { mockProducts } from '../utils/mockProducts';

        3.6 Asynnc/Await
        - Used for asynchronous operations
        - Example:
         const fetchProducts = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setProducts(mockProducts);
        };

        3.7 Default Paramteres
        - Used to provide default values for function paramteres
        -Example:
            const removeFromFavorites = (productId = null) => {
            setFavorites((prevFavorites) =>
                prevFavorites.filter((item) => item.id !== productId)
            );
            };

        3.8 Array Methods
        - Used for filtering,mapping, and reducing data
        - Example:
            const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
