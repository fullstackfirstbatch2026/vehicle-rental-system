import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Car, CalendarDays, User, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";

function RentVehicle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!vehicleId) {
      setError("Vehicle ID is missing.");
      setLoading(false);
      toast.error("Vehicle ID is missing.");
      return;
    }

    Promise.all([
      api.get(`/vehicles/${vehicleId}`),
      api.get("/customers"),
    ])
      .then(([vehicleResponse, customerResponse]) => {
        setVehicle(vehicleResponse.data);
        setCustomers(customerResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load vehicle information.");
        setLoading(false);
        toast.error("Unable to load vehicle information.");
      });
  }, [vehicleId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;
    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const days = calculateDays();

  const estimatedAmount =
    vehicle && days
      ? Number(vehicle.dailyRate) * days
      : 0;

  const handleRent = async (event) => {
    event.preventDefault();

    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      toast.error("Please select a customer.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select rental dates.");
      toast.error("Please select rental dates.");
      return;
    }

    if (days <= 0) {
      setError("End date must be after start date.");
      toast.error("End date must be after start date.");
      return;
    }

    if (vehicle.status !== "AVAILABLE") {
      setError("This vehicle is not available.");
      toast.error("This vehicle is not available.");
      return;
    }

    try {
      setRenting(true);

      await api.post("/rentals/rent", {
        vehicleId: Number(vehicleId),
        customerId: Number(customerId),
        startDate,
        endDate,
      });

      toast.success("Vehicle rented successfully!");

      setTimeout(() => {
        navigate("/rentals");
      }, 1000);

    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message ||
        "Unable to rent vehicle.";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setRenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>

        <p className="mt-4 text-slate-500">
          Loading vehicle information...
        </p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Vehicle not found."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Rent Vehicle
        </h1>

        <p className="text-slate-500 mt-1">
          Complete the rental details below
        </p>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="md:flex">

          {/* Image */}
          <div className="md:w-2/5 h-64 md:h-auto bg-slate-200">

            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={60} className="text-slate-400" />
              </div>
            )}

          </div>

          {/* Details */}
          <div className="p-6 flex-1">

            <h2 className="text-2xl font-bold text-slate-900">
              {vehicle.make} {vehicle.model}
            </h2>

            <p className="text-slate-500 mt-1">
              {vehicle.vehicleYear} • {vehicle.vehicleType}
            </p>

            <div className="mt-5 space-y-3 text-sm">

              <div className="flex items-center gap-2">
                <Car size={18} />
                {vehicle.registrationNumber}
              </div>

              <div className="flex items-center gap-2">
                <IndianRupee size={18} />
                ₹{Number(vehicle.dailyRate).toLocaleString("en-IN")} / day
              </div>

              <div>
                Status:
                <span
                  className={`ml-2 font-semibold ${
                    vehicle.status === "AVAILABLE"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Rental Form */}
      <form
        onSubmit={handleRent}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mt-6 p-6"
      >

        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Rental Details
        </h2>

        {/* Customer */}
        <div className="mb-5">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Customer
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg py-2.5 pl-10 pr-4"
            >

              <option value="">
                Select customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.customerId}
                  value={customer.customerId}
                >
                  {customer.fullName} — {customer.phone}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg py-2.5 pl-10 pr-4"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg py-2.5 pl-10 pr-4"
              />

            </div>

          </div>

        </div>

        {/* Price */}
        {days > 0 && (
          <div className="mt-6 bg-slate-50 rounded-lg p-5">

            <div className="flex justify-between text-sm text-slate-600">
              <span>Rental Duration</span>
              <span>{days} day(s)</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>Daily Rate</span>
              <span>
                ₹{Number(vehicle.dailyRate).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between">

              <span className="font-semibold text-slate-900">
                Estimated Total
              </span>

              <span className="text-xl font-bold text-slate-900">
                ₹{estimatedAmount.toLocaleString("en-IN")}
              </span>

            </div>

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={
            vehicle.status !== "AVAILABLE" || renting
          }
          className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {renting ? "Processing Rental..." : "Confirm Rental"}
        </button>

      </form>

    </div>
  );
}

export default RentVehicle;