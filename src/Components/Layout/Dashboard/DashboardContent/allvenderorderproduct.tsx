import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";

const Allvenderorderproduct = () => {
  const [rows, setRows] = useState([]);
  const token = Cookies.get("sellerToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/vendor/get-all-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allRows = [];

        response.data?.forEach((order) => {
          const itemQty = order.orderItems.reduce(
            (acc, item) => acc + (item.quantity || 0),
            0
          );

          order.orderItems.forEach((item, index) => {
            allRows.push({
              id: item._id || `${order._id}-${index}`,
              status: item.status || order.orderStatus || "Pending",
              item_qty: item.quantity || 0,
              orderDate: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
              total: item.totalAmount || order.totalAmount || 0,
              customer: item.user?.name || order.user?.name || "N/A",
              paymentMode: item.paymentMode || order.paymentMode || "N/A",
              orderId: order._id,
            });
          });
        });

        setRows(allRows);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  const columns = [
    { field: "id", headerName: "Order Item ID", minWidth: 150, flex: 1 },
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
      headerName: "Qty",
      type: "number",
      minWidth: 80,
      flex: 0.4,
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
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      minWidth: 150,
      flex: 0.6,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.4,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/seller/order/${params.row.orderId}`}>
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
        getRowId={(row) => row.id}
        disableSelectionOnClick
        autoHeight
      />
    </motion.div>
  );
};

export default Allvenderorderproduct;
