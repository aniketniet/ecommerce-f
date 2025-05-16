import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";

const AllOrders = () => {
  const [rows, setRows] = useState([]);

  const token = Cookies.get("sellerToken");
  console.log(token, "uyrgfuygrd");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/vendor/get-all-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const allRows = [];

        response.data?.forEach((order) => {
          const itemQty = order.orderItems.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          allRows.push({
  id: order.id,
  status: order.status || order.orderStatus,
  item_qty: itemQty,
  orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
  total: order.totalAmount,
  customer: order.user?.name || "N/A",
  paymentMode: order.paymentMode || "N/A",
});

        });

        setRows(allRows);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.8 },
     {
  field: "customer",
  headerName: "Customer",
  minWidth: 150,
  flex: 0.8,
},
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
    },
    
    {
      field: "item_qty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 10,
      flex: 0.5,
    },
    
    {
      field: "orderDate",
      headerName: "Order Date",
      minWidth: 200,
      flex: 0.8,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
   
{
  field: "paymentMode",
  headerName: "Payment Mode",
  minWidth: 150,
  flex: 0.6,
},

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/seller/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight
                size={20}
                className="cursor-pointer hover:text-[#3957db] transition-colors"
              />
            </Button>
          </Link>
        );
      },
    },
  ];

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
        // autoHeight
      />
    </motion.div>
  );
};

export default AllOrders;
