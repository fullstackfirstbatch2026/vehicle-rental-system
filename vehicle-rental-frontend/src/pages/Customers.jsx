import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    drivingLicense: "",
    address: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Unable to load customers.");
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const openAddForm = () => {
    setEditingCustomer(null);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      drivingLicense: "",
      address: "",
    });

    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      fullName: customer.fullName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      drivingLicense: customer.drivingLicense || "",
      address: customer.address || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingCustomer) {
        await api.put(
          `/customers/${editingCustomer.customerId}`,
          formData
        );

        toast.success("Customer updated successfully!");
      } else {
        await api.post("/customers", formData);

        toast.success("Customer added successfully!");
      }

      closeForm();
      loadCustomers();
    } catch (error) {
      console.error("Customer save error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save customer."
      );
    }
  };

  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/customers/${customerId}`);

      toast.success("Customer deleted successfully!");

      loadCustomers();
    } catch (error) {
      console.error("Delete error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete customer."
      );
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      customer.email
        ?.toLowerCase()
        .includes(searchText) ||
      customer.phone
        ?.toLowerCase()
        .includes(searchText) ||
      customer.drivingLicense
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customers
          </h1>

          <p className="text-slate-500 mt-1">
            Manage customer information and driving licenses
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
        >
          <UserPlus size={19} />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <Users
              size={25}
              className="text-slate-700"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Customers
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {customers.length}
            </p>
          </div>

        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="relative">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name, email, phone or driving license..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />

        </div>
      </div>

      {/* Customer Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingCustomer
                  ? "Edit Customer"
                  : "Add New Customer"}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter the customer details below
              </p>
            </div>

            <button
              onClick={closeForm}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Driving License */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Driving License
                </label>

                <input
                  type="text"
                  name="drivingLicense"
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter driving license"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter customer address"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                {editingCustomer
                  ? "Update Customer"
                  : "Save Customer"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Customer Count */}
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredCustomers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {customers.length}
          </span>{" "}
          customers
        </p>
      </div>

      {/* Customer Table */}
      {filteredCustomers.length > 0 ? (

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Contact
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Driving License
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Address
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredCustomers.map((customer) => (

                  <tr
                    key={customer.customerId}
                    className="hover:bg-slate-50"
                  >

                    {/* Customer */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                          {customer.fullName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {customer.fullName}
                          </p>

                          <p className="text-xs text-slate-500">
                            Customer #{customer.customerId}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">

                      <p className="text-sm text-slate-800">
                        {customer.email}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {customer.phone}
                      </p>

                    </td>

                    {/* License */}
                    <td className="px-6 py-5">

                      <span className="inline-flex px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                        {customer.drivingLicense}
                      </span>

                    </td>

                    {/* Address */}
                    <td className="px-6 py-5">

                      <p className="text-sm text-slate-600 max-w-xs">
                        {customer.address || "-"}
                      </p>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditForm(customer)
                          }
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                          title="Edit customer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              customer.customerId
                            )
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete customer"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      ) : (

        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

          <Users
            size={45}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold text-slate-800">
            No customers found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try a different search term.
          </p>

        </div>

      )}

    </div>
  );
}

export default Customers;