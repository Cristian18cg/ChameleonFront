import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { BsBoxSeam, BsTruck, BsCheckCircle } from "react-icons/bs";
import { MdError } from "react-icons/md";
import useControlPedidos from "../../../hooks/useControlPedidos";
const OrderDashboard = () => {
  const { listarPedidosUsuario, pedidosUsuario, loadingPedidosUsuario } =
    useControlPedidos();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const ordersPerPage = 5;

 
  useEffect(() => {
    if (pedidosUsuario.length === 0) {
      listarPedidosUsuario();
    } else {
      setOrders(pedidosUsuario);
    }
    console.log(pedidosUsuario);
  }, [pedidosUsuario]);

  useEffect(() => {
    try {
      setFilteredOrders(pedidosUsuario);
    } catch (err) {
      setError("Failed to load orders");
    }
  }, []);

   useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.id ||
        order.order_value;
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, orders]); 

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <BsBoxSeam className="text-yellow-500" />;
      case "shipped":
        return <BsTruck className="text-blue-500" />;
      case "delivered":
        return <BsCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  const MobileOrderCard = ({ order }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-900">{order.id}</span>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="capitalize text-sm">{order.status}</span>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-600">Date: {order.date}</p>
        <p className="text-sm font-medium text-gray-900 mt-1">
          Total: ${order.totalAmount.toFixed(2)}
        </p>
      </div>
      <div className="space-y-3">
        {order.products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 p-2 rounded"
          >
            {/* <img
              src={`${product.images[0]?.image_url}`}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
              }}
            /> */}
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">
                Quantity: {product.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loadingPedidosUsuario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <MdError className="text-2xl mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management Dashboard</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  # Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha creación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  role="row"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-col gap-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <img
                            src={`https://${product.imageUrl}`}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                            }}
                          />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.name} (x{product.quantity})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {currentOrders.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found matching your criteria
        </div>
      )}

      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastOrder, filteredOrders.length)}
              </span>{" "}
              of <span className="font-medium">{filteredOrders.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
