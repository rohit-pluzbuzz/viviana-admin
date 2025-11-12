# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Frontend folder structure
viviana-admin/
├── node_modules/
│   ├── 
│
├── public/
│   ├── 
│
├── src/
│    │
│    ├── api/
│    │   ├── api.js                    # Axios base config
│    │   └── axiosInstance.js 
│    │   └── productService.js        # API functions for products
│    │
│    ├── assets/
│    │   ├──    
│    │
│    ├── components/
│    │   ├── layout/
│    │   │   ├── Sidebar.jsx           # Navigation sidebar
│    │   │   └── Header.jsx            # (Optional) Top header for branding, logout, etc.
│    │   │
│    │   ├── products/
│    │   │   ├── ProductList.jsx       # View all products in a table/grid
│    │   │   ├── ProductForm.jsx       # Add/Edit product
│    │   │   └── ProductDetails.jsx    # Single product detail view
│    │   │
│    │   ├── categories/
│    │   │   └── CategoryManager.jsx   # Add/Edit/Delete categories
│    │   │
│    │   └── PrivateRoute.jsx 
│    │   
│    ├── context/
│    │   ├── AuthContext.jsx           # Authentication context
│    │   ├── CategoryContext.jsx   
│    │   └── ProductContext.jsx  
│    │
│    ├── pages/
│    │   ├── Dashboard.jsx             
│    │   ├── Login.jsx      
│    │   ├── Signup.jsx        
│    │   └── NotFound.jsx              # 404 fallback
│    │
│    ├── utils/
│    │   ├── config.js          
│    │   └── uploadImage.js           
│    │
│    ├── App.jsx                       # Main router + layout wrapper
│    ├── index.css                     # TailwindCSS
│    └── main.jsx                      # Entry point
│
├──  .gitignore
├──  eslint.config.js
├──  index.html
├──  package-lock.json
├──  package.json
├──  README.md
└──  vite.config.js

## Backend folder structure
viviana-backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── productController.js
│   └── uploadController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── upload.js
│   └── verifyToken.js
│
├── node_modules/
│   ├── 
│
├── routes/
│   ├── auth.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   └── uploadRoutes.js
│
├── uploads/
│   ├── img.png                  # Uploaded images will be stored here
│
├── .env
├── package-lock.json
├── package.json
├── README.md
└── server.js
