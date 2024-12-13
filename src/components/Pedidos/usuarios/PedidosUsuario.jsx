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
import useControl from "../../../hooks/useControl";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { MdOutlineCancel } from "react-icons/md";
const OrderDashboard = () => {
  const {
    listarPedidosUsuario,
    pedidosUsuario,
    loadingPedidosUsuario,
    CancelarPedido,
  } = useControlPedidos();
  const { token } = useControl();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const ordersPerPage = 5;
  const [pedidoEliminar, setpedidoEliminar] = useState(null);
  useEffect(() => {
    if (pedidosUsuario.length === 0 && token) {
      listarPedidosUsuario();
    } else {
      setOrders(pedidosUsuario);
    }
  }, [pedidosUsuario, token]);

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
        searchQuery === "" ||
        order.id.toString().includes(searchQuery) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
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
      case "PROCESSING":
        return <BsTruck className="text-blue-500" />;
      case "COMPLETED":
        return <BsCheckCircle className="text-green-500" />;
      case "CANCELLED":
        return <MdOutlineCancel className="text-red-500" />;
      default:
        return null;
    }
  };

  const getOrderMessage = (STATUS) => {
    switch (STATUS) {
      case "COMPLETED":
        return "ENTREGADO";

      case "CANCELLED":
        return "CANCELADO";

      case "PENDING":
        return "PENDIENTE";

      case "PROCESSING":
        return "PROCESANDO";

      default:
        return null;
    }
  };

  const accept = (id) => {
    CancelarPedido(id); 
  };

  const reject = () => {};

  const confirm1 = (id) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el pedido #${id}?`,
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => accept(id), // Pasamos el ID directamente aquí
      reject,
    });
  };

  const MobileOrderCard = ({ order }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-900"># {order.id}</span>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="capitalize text-sm">
            {getOrderMessage(order.status)}
          </span>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Fecha creación:{" "}
          {new Date(order.created_at).toLocaleString("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="text-sm font-medium text-gray-900 mt-1">
          Total:
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(order.order_value)}
        </p>
      </div>
      <div className="space-y-3">
        {order.products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 p-2 rounded"
          >
            <img
              src={`${product.images[0]?.image_url}`}
              alt={product.product_name}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
              }}
            />
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">
                Cantidad: {product.quantity}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">
                Valor unitario:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(product.unit_price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">
                Subtotal producto:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(product.subtotal)}
              </p>
            </div>
          </div>
        ))}
        {order.status === "PENDING" && (
          <Button
            onClick={() => confirm1(order.id)}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-600"
            label=" Cancelar Pedido"
            icon="pi pi-trash"
            iconPosition="left"
            severity="danger"
          ></Button>
        )}
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
      <h1 className="text-3xl font-bold mb-8">Mis pedidos</h1>
      <ConfirmDialog />
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedidos..."
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
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="COMPLETED">Completado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden ">
        <div className="overflow-x-auto p-10">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancelar pedido
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
                            src={`${product.images[0]?.image_url}`}
                            alt={product.product_name}
                            className="w-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                            }}
                          />
                          <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {product.product_name} (x{product.quantity})
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Precio unitario:{" "}
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(product.unit_price)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Subtotal:{" "}
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(product.subtotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(order.order_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">
                        {getOrderMessage(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString("es-ES", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="   whitespace-nowrap text-sm text-gray-500">
                    {order.status === "PENDING" && (
                      <Button
                        onClick={() => confirm1(order.id)}
                        icon="pi pi-trash"
                        outlined
                        rounded
                        className="mx-10"
                        severity="danger"
                      ></Button>
                    )}
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
          No se encontraron pedidos en nuestra base de datos.
        </div>
      )}

      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Viendo{" "}
              <span className="font-medium">{indexOfFirstOrder + 1}</span> de{" "}
              <span className="font-medium">
                {Math.min(indexOfLastOrder, filteredOrders.length)}
              </span>{" "}
              de <span className="font-medium">{filteredOrders.length}</span>{" "}
              pedidos
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
                <span className="sr-only">Anterior</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Siguiente</span>
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
