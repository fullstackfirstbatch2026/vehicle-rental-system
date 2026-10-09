import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Car,
  User,
  CalendarDays,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);

      const response = await api.get("/rentals/details");

      setRentals(response.data);
    } catch (error) {
      console.error("Error loading rentals:", error);

      toast.error("Unable to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this vehicle?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      await api.put(`/rentals/${rentalId}/return`);

      toast.success("Vehicle returned successfully!");

      loadRentals();
    } catch (error) {
      console.error("Return error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to return vehicle."
      );
    }
  };

  const filteredRentals = rentals.filter((rental) => {
    const customerName = rental[2] || "";
    const email = rental[3] || "";
    const registrationNumber = rental[6] || "";
    const make = rental[7] || "";
    const model = rental[8] || "";
    const status = rental[14] || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      customerName.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      registrationNumber.toLowerCase().includes(searchText) ||
      make.toLowerCase().includes(searchText) ||
      model.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Rentals
        </h1>

        <p className="text-slate-500 mt-1">
          Manage active and completed vehicle rentals
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Search */}
          <div className="relative">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search customer, vehicle or registration..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            />

          </div>

          {/* Status Filter */}
          <div className="relative">

            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 bg-white"
            >
              <option value="ALL">
                All Rentals
              </option>

              <option value="ACTIVE">
                Active Rentals
              </option>

              <option value="RETURNED">
                Returned Rentals
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* Result Count */}
      <div className="mb-5">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredRentals.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {rentals.length}
          </span>{" "}
          rentals
        </p>

      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">
            Loading rentals...
          </p>
        </div>
      )}

      {/* No Rentals */}
      {!loading && filteredRentals.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

          <Car
            size={45}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold text-slate-800">
            No rentals found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search or filter.
          </p>

        </div>
      )}

      {/* Rental Cards */}
      {!loading && filteredRentals.length > 0 && (
        <div className="space-y-5">

          {filteredRentals.map((rental) => {

            const rentalId = rental[0];
            const customerName = rental[2];
            const email = rental[3];
            const registrationNumber = rental[6];
            const make = rental[7];
            const model = rental[8];
            const vehicleType = rental[9];
            const startDate = rental[10];
            const expectedReturnDate = rental[11];
            const actualReturnDate = rental[12];
            const totalAmount = rental[13];
            const status = rental[14];

            return (
              <div
                key={rentalId}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >

                {/* Top Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Rental & Customer */}
                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Car
                        size={25}
                        className="text-slate-700"
                      />
                    </div>

                    <div>

                      <div className="flex items-center gap-3">

                        <h2 className="text-lg font-bold text-slate-900">
                          {make} {model}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>

                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        Rental #{rentalId} •{" "}
                        {registrationNumber}
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                        <User size={16} />
                        {customerName}
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        {email}
                      </p>

                    </div>

                  </div>

                  {/* Amount */}
                  <div className="text-left lg:text-right">

                    <p className="text-xs text-slate-500">
                      Total Amount
                    </p>

                    <p className="text-2xl font-bold text-slate-900 flex items-center lg:justify-end">
                      <IndianRupee size={20} />
                      {Number(totalAmount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">

                  <div className="bg-slate-50 rounded-lg p-4">

                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <CalendarDays size={16} />
                      <span className="text-xs">
                        Start Date
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800">
                      {startDate || "-"}
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <CalendarDays size={16} />
                      <span className="text-xs">
                        Expected Return
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800">
                      {expectedReturnDate || "-"}
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <CalendarDays size={16} />
                      <span className="text-xs">
                        Actual Return
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800">
                      {actualReturnDate || "-"}
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Car size={16} />
                      <span className="text-xs">
                        Vehicle Type
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800">
                      {vehicleType || "-"}
                    </p>

                  </div>

                </div>

                {/* Return Button */}
                {status === "ACTIVE" && (
                  <div className="mt-5 flex justify-end">

                    <button
                      onClick={() =>
                        handleReturn(rentalId)
                      }
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
                    >
                      Return Vehicle
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Rentals;