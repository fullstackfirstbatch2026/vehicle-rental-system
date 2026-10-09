import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Car,
  CalendarDays,
  Gauge,
} from "lucide-react";

import api from "../api/api";

function Vehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/vehicles");

      setVehicles(response.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique vehicle types
  const vehicleTypes = [
    "ALL",
    ...new Set(vehicles.map((vehicle) => vehicle.vehicleType)),
  ];

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      vehicle.make?.toLowerCase().includes(searchText) ||
      vehicle.model?.toLowerCase().includes(searchText) ||
      vehicle.registrationNumber
        ?.toLowerCase()
        .includes(searchText);

    const matchesType =
      typeFilter === "ALL" ||
      vehicle.vehicleType === typeFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      vehicle.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Vehicles
        </h1>

        <p className="text-slate-500 mt-1">
          Browse and manage your vehicle fleet
        </p>

      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}
          <div className="relative">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            />

          </div>

          {/* Type Filter */}
          <div className="relative">

            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 bg-white"
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL"
                    ? "All Vehicle Types"
                    : type}
                </option>
              ))}
            </select>

          </div>

          {/* Status Filter */}
          <div className="relative">

            <Gauge
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
                All Status
              </option>

              <option value="AVAILABLE">
                Available
              </option>

              <option value="RENTED">
                Rented
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between mb-5">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredVehicles.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {vehicles.length}
          </span>{" "}
          vehicles
        </p>

      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">
            Loading vehicles...
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredVehicles.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

          <Car
            size={40}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold text-slate-800">
            No vehicles found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search or filters.
          </p>

        </div>
      )}

      {/* Vehicle Cards */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredVehicles.map((vehicle) => (

            <div
              key={vehicle.vehicleId}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
            >

              {/* Image */}
              <div className="relative h-52 bg-slate-100">

                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car
                      size={60}
                      className="text-slate-300"
                    />
                  </div>
                )}

                {/* Status */}
                <div className="absolute top-4 right-4">

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vehicle.status}
                  </span>

                </div>

              </div>

              {/* Content */}
              <div className="p-5">

                {/* Vehicle Name */}
                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {vehicle.make} {vehicle.model}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {vehicle.registrationNumber}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xl font-bold text-slate-900">
                      ₹
                      {Number(
                        vehicle.dailyRate
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="text-xs text-slate-500">
                      per day
                    </p>

                  </div>

                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 mt-5">

                  <div className="bg-slate-50 rounded-lg p-3 text-center">

                    <CalendarDays
                      size={17}
                      className="mx-auto text-slate-500 mb-1"
                    />

                    <p className="text-xs text-slate-500">
                      Year
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {vehicle.vehicleYear}
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-center">

                    <Car
                      size={17}
                      className="mx-auto text-slate-500 mb-1"
                    />

                    <p className="text-xs text-slate-500">
                      Type
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {vehicle.vehicleType}
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-center">

                    <Gauge
                      size={17}
                      className="mx-auto text-slate-500 mb-1"
                    />

                    <p className="text-xs text-slate-500">
                      Status
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {vehicle.status}
                    </p>

                  </div>

                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate(
                      `/rent?vehicleId=${vehicle.vehicleId}`
                    )
                  }
                  disabled={
                    vehicle.status !== "AVAILABLE"
                  }
                  className={`w-full mt-5 py-3 rounded-lg font-semibold transition ${
                    vehicle.status === "AVAILABLE"
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {vehicle.status === "AVAILABLE"
                    ? "Rent Vehicle"
                    : "Currently Rented"}
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Vehicles;