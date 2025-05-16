import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
const Order = () => {
  const [rows, setRows] = useState([]);
  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/web/get-orders`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("res", res.data);

      const formattedRows = res.data?.map((order) => {

        const itemCount = order?.orderItems?.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // Format createdAt to dd/mm/yy
        let paymentStatus = "Pending";
        if (order?.createdAt) {
          const date = new Date(order.createdAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear()).slice(-2);
          paymentStatus = `${day}/${month}/${year}`;
        }

        return {
          id: order?.id,
          status: order?.orderStatus || "Processing",
          item_qty: itemCount || 0,
          payment_status: paymentStatus,
          total: order?.totalAmount || 0,
        };
      }) || [];

        setRows(formattedRows);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        if (params.row.status === "Delivered" || params.row.status === "Success") {
          return "text-green-500";
        }
        if (params.row.status === "Pending") {
          return "text-yellow-500";
        }
        return "text-red-500";
      },
    },
    {
      field: "item_qty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "payment_status",
      headerName: "Date",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user-order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight
              size={20}
              className="cursor-pointer hover:text-[#3957db] transition-colors"
            />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -500 }}
      className="pl-8 pt-1"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </motion.div>
  );
};

export default Order;
