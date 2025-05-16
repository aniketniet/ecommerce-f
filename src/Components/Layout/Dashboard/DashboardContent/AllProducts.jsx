import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { DataGrid } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("sellerToken");

  const fetchProducts = async () => {
    setLoading(true);
    const o = import.meta.env.VITE_BASE_URL;
    console.log(o, 'oooo');
    
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vendor/get-my-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(data.data)
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((product) => product.id !== productId));
      // console.log(products)
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.8 },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.8 },
    { field: "sold", headerName: "Sold Out", type: "number", minWidth: 100, flex: 0.6 },
    {
      field: "preview",
      headerName: "Preview",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/vendor/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];
  const rows = products.map((product, index) => {
    const variant =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants[0]
        : { price: 0, stock: 0 };
  
    return {
      id: product.id || product._id || index, // fallback if `id` is missing
      name: product.name || "N/A",
      price: `₹${variant.price ?? "N/A"}`,
      stock: variant.stock ?? 0,
      sold: product.sold ?? 0,
    };
  });
  

  console.log(rows, "rows");
  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -500 }}
      className="w-full bg-white"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        
        loading={loading}
      />
    </motion.div>
  );
};

export default AllProducts;
