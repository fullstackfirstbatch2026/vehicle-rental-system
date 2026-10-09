import { useEffect, useState } from "react";
import {
  Search,
  CreditCard,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    rentalId: "",
    amount: "",
    paymentMethod: "UPI",
    paymentStatus: "PAID",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsResponse, rentalsResponse] =
        await Promise.all([
          api.get("/payments"),
          api.get("/rentals"),
        ]);

      setPayments(paymentsResponse.data);
      setRentals(rentalsResponse.data);
    } catch (error) {
      console.error("Error loading payment data:", error);

      toast.error("Unable to load payment data.");
    }
  };

  const handleRentalChange = (event) => {
    const rentalId = event.target.value;

    const selectedRental = rentals.find(
      (rental) =>
        String(rental.rentalId) === String(rentalId)
    );

    setFormData({
      ...formData,
      rentalId,
      amount: selectedRental
        ? selectedRental.totalAmount
        : "",
    });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const closeForm = () => {
    setShowForm(false);

    setFormData({
      rentalId: "",
      amount: "",
      paymentMethod: "UPI",
      paymentStatus: "PAID",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post("/payments", {
        rentalId: Number(formData.rentalId),
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
      });

      toast.success("Payment recorded successfully!");

      closeForm();
      loadData();
    } catch (error) {
      console.error("Payment error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to record payment."
      );
    }
  };

  // Rentals which already have a PAID payment
  const paidRentalIds = new Set(
    payments
      .filter(
        (payment) => payment.paymentStatus === "PAID"
      )
      .map((payment) => payment.rentalId)
  );

  // Only allow unpaid rentals
  const availableRentals = rentals.filter(
    (rental) => !paidRentalIds.has(rental.rentalId)
  );

  // Revenue
  const totalRevenue = payments
    .filter(
      (payment) => payment.paymentStatus === "PAID"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const pendingAmount = payments
    .filter(
      (payment) => payment.paymentStatus === "PENDING"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    const rentalText = `rental ${payment.rentalId}`;
    const method = payment.paymentMethod || "";
    const status = payment.paymentStatus || "";

    const matchesSearch =
      rentalText.toLowerCase().includes(searchText) ||
      method.toLowerCase().includes(searchText) ||
      status.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payments
          </h1>

          <p className="text-slate-500 mt-1">
            Manage rental payments and transaction records
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
        >
          <Plus size={19} />
          Record Payment
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <IndianRupee
                size={23}
                className="text-green-700"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Revenue
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>

          </div>

        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <IndianRupee
                size={23}
                className="text-yellow-700"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Amount
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{pendingAmount.toLocaleString("en-IN")}
              </p>
            </div>

          </div>

        </div>

        {/* Transactions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
              <CreditCard
                size={23}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Transactions
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {payments.length}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search rental, payment method or status..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
          >
            <option value="ALL">
              All Payment Status
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="FAILED">
              Failed
            </option>

          </select>

        </div>

      </div>

      {/* Payment Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Record Payment
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Add a payment for a rental
              </p>
            </div>

            <button
              onClick={closeForm}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>

          </div>

          {availableRentals.length === 0 ? (

            <div className="bg-slate-50 rounded-lg p-5 text-center">

              <p className="font-semibold text-slate-800">
                No unpaid rentals available
              </p>

              <p className="text-sm text-slate-500 mt-1">
                All existing rentals already have a paid
                payment.
              </p>

            </div>

          ) : (

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Rental */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rental
                  </label>

                  <select
                    name="rentalId"
                    value={formData.rentalId}
                    onChange={handleRentalChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
                  >
                    <option value="">
                      Select Rental
                    </option>

                    {availableRentals.map((rental) => (
                      <option
                        key={rental.rentalId}
                        value={rental.rentalId}
                      >
                        Rental #{rental.rentalId} — ₹
                        {Number(
                          rental.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  />

                </div>

                {/* Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK TRANSFER">
                      Bank Transfer
                    </option>
                  </select>

                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Status
                  </label>

                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 border border-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Payment
                </button>

              </div>

            </form>

          )}

        </div>
      )}

      {/* Results */}
      <div className="mb-4">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredPayments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {payments.length}
          </span>{" "}
          payments
        </p>

      </div>

      {/* Table */}
      {filteredPayments.length > 0 ? (

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Payment
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Rental
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Method
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredPayments.map((payment) => (

                  <tr
                    key={payment.paymentId}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <CreditCard
                            size={19}
                            className="text-slate-700"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            Payment #{payment.paymentId}
                          </p>

                          <p className="text-xs text-slate-500">
                            {payment.paymentDate || "No date"}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-800">
                        Rental #{payment.rentalId}
                      </span>
                    </td>

                    <td className="px-6 py-5">

                      <span className="font-bold text-slate-900">
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-700">
                        {payment.paymentMethod}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : payment.paymentStatus ===
                              "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      ) : (

        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

          <CreditCard
            size={45}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold text-slate-800">
            No payments found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search or filter.
          </p>

        </div>

      )}

    </div>
  );
}

export default Payments;