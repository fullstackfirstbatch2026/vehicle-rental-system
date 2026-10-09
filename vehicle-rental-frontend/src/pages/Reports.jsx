import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Car,
  IndianRupee,
  TrendingUp,
  Search,
} from "lucide-react";

import api from "../api/api";

function Reports() {
  const [frequentVehicles, setFrequentVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [
        frequentResponse,
        rentalsResponse,
        paymentsResponse,
      ] = await Promise.all([
        api.get("/rentals/frequent-vehicles"),
        api.get("/rentals/details"),
        api.get("/payments"),
      ]);

      setFrequentVehicles(frequentResponse.data);
      setRentals(rentalsResponse.data);
      setPayments(paymentsResponse.data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = useMemo(() => {
    return payments
      .filter(
        (payment) => payment.paymentStatus === "PAID"
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );
  }, [payments]);

  const totalRentals = rentals.length;

  const activeRentals = rentals.filter(
    (rental) => rental[14] === "ACTIVE"
  ).length;

  const returnedRentals = rentals.filter(
    (rental) => rental[14] === "RETURNED"
  ).length;

  const filteredRentals = rentals.filter((rental) => {
    const customerName = rental[2] || "";
    const registrationNumber = rental[6] || "";
    const make = rental[7] || "";
    const model = rental[8] || "";
    const status = rental[14] || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      customerName.toLowerCase().includes(searchText) ||
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
          Reports & Analytics
        </h1>

        <p className="text-slate-500 mt-1">
          Analyze rental activity, revenue and vehicle performance
        </p>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">
            Loading reports...
          </p>
        </div>

      ) : (

        <>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {/* Revenue */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Revenue
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <IndianRupee
                    size={23}
                    className="text-green-700"
                  />
                </div>

              </div>

            </div>

            {/* Rentals */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Rentals
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {totalRentals}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Car
                    size={23}
                    className="text-slate-700"
                  />
                </div>

              </div>

            </div>

            {/* Active */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Active Rentals
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {activeRentals}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp
                    size={23}
                    className="text-green-700"
                  />
                </div>

              </div>

            </div>

            {/* Returned */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Returned Rentals
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {returnedRentals}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BarChart3
                    size={23}
                    className="text-blue-700"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Frequently Rented Vehicles */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-8">

            <div className="p-6 border-b border-slate-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <BarChart3
                    size={20}
                    className="text-slate-700"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Frequently Rented Vehicles
                  </h2>

                  <p className="text-sm text-slate-500">
                    Vehicles rented more frequently than the average
                  </p>

                </div>

              </div>

            </div>

            {frequentVehicles.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Vehicle
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Registration
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Type
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Rental Count
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {frequentVehicles.map(
                      (vehicle, index) => {

                        const vehicleId = vehicle[0];
                        const registration = vehicle[1];
                        const make = vehicle[2];
                        const model = vehicle[3];
                        const type = vehicle[4];
                        const count = vehicle[5];

                        return (
                          <tr
                            key={vehicleId}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>

                                <div>

                                  <p className="font-semibold text-slate-900">
                                    {make} {model}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    Vehicle #{vehicleId}
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-6 py-5">
                              <span className="text-sm font-medium text-slate-700">
                                {registration}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                                {type}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">

                              <span className="text-lg font-bold text-slate-900">
                                {count}
                              </span>

                              <span className="text-xs text-slate-500 ml-1">
                                rentals
                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="p-10 text-center">

                <Car
                  size={45}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="font-semibold text-slate-800">
                  No frequently rented vehicles
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  More rental data is needed for this report.
                </p>

              </div>

            )}

          </div>

          {/* Rental History */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="p-6 border-b border-slate-200">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Rental History
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Complete rental transaction history
                  </p>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  <div className="relative">

                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      placeholder="Search rentals..."
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      className="border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 outline-none"
                    />

                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="border border-slate-300 rounded-lg px-4 py-2.5 bg-white"
                  >
                    <option value="ALL">
                      All Status
                    </option>

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="RETURNED">
                      Returned
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {filteredRentals.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Rental
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Vehicle
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Dates
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Amount
                      </th>

                      <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredRentals.map((rental) => {

                      const rentalId = rental[0];
                      const customerName = rental[2];
                      const registration = rental[6];
                      const make = rental[7];
                      const model = rental[8];
                      const startDate = rental[10];
                      const endDate = rental[11];
                      const amount = rental[13];
                      const status = rental[14];

                      return (
                        <tr
                          key={rentalId}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-6 py-5">

                            <p className="font-semibold text-slate-900">
                              #{rentalId}
                            </p>

                          </td>

                          <td className="px-6 py-5">

                            <p className="font-medium text-slate-800">
                              {customerName}
                            </p>

                          </td>

                          <td className="px-6 py-5">

                            <p className="font-medium text-slate-800">
                              {make} {model}
                            </p>

                            <p className="text-xs text-slate-500">
                              {registration}
                            </p>

                          </td>

                          <td className="px-6 py-5">

                            <p className="text-sm text-slate-700">
                              {startDate}
                            </p>

                            <p className="text-xs text-slate-500">
                              to {endDate}
                            </p>

                          </td>

                          <td className="px-6 py-5 text-right">

                            <span className="font-bold text-slate-900">
                              ₹
                              {Number(
                                amount || 0
                              ).toLocaleString("en-IN")}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-center">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {status}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="p-10 text-center">

                <BarChart3
                  size={45}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="font-semibold text-slate-800">
                  No rental records found
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your search or filter.
                </p>

              </div>

            )}

          </div>

        </>

      )}

    </div>
  );
}

export default Reports;