import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

import {
  Car,
  CarFront,
  ClipboardList,
  Users,
  IndianRupee,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeRentals: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, rentalsResponse] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/rentals/details"),
        ]);

        setStats(statsResponse.data);

        // Show latest 5 rentals
        const rentals = rentalsResponse.data || [];
        setRecentRentals(rentals.slice(-5).reverse());

      } catch (error) {
        console.error("Error loading dashboard:", error);

        toast.error(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Car,
      description: "Registered vehicles",
    },
    {
      title: "Available Vehicles",
      value: stats.availableVehicles,
      icon: CarFront,
      description: "Ready for rental",
    },
    {
      title: "Active Rentals",
      value: stats.activeRentals,
      icon: ClipboardList,
      description: "Currently rented",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "Paid rental revenue",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>

        <p className="mt-4 text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Overview of your vehicle rental business
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <TrendingUp size={18} />
          Business Overview
        </div>

      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {card.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-2">
                    {card.description}
                  </p>
                </div>

                <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Icon
                    size={22}
                    className="text-slate-700"
                  />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Quick Actions */}
      <div className="mt-8">

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Quickly access the most commonly used sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <Link
            to="/vehicles"
            className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                <Car size={21} className="text-slate-700" />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              Browse Vehicles
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              View availability and rent a vehicle.
            </p>

          </Link>

          <Link
            to="/rentals"
            className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                <ClipboardList
                  size={21}
                  className="text-slate-700"
                />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              Manage Rentals
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Track active rentals and returns.
            </p>

          </Link>

          <Link
            to="/customers"
            className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                <Users size={21} className="text-slate-700" />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              Manage Customers
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Add or update customer information.
            </p>

          </Link>

        </div>

      </div>

      {/* Recent Rentals */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Rentals
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest rental transactions
            </p>
          </div>

          <Link
            to="/rentals"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

        {recentRentals.length === 0 ? (

          <div className="p-10 text-center">

            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <ClipboardList
                size={22}
                className="text-slate-400"
              />
            </div>

            <p className="mt-3 font-medium text-slate-700">
              No rental transactions yet
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Rental activity will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {recentRentals.map((rental) => (

              <div
                key={rental[0]}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Clock
                      size={20}
                      className="text-slate-600"
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      {rental[7]} {rental[8]}
                    </p>

                    <p className="text-sm text-slate-500">
                      {rental[2]} · Rental #{rental[0]}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span className="font-semibold text-slate-900">
                    ₹
                    {Number(rental[13]).toLocaleString("en-IN")}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rental[14] === "ACTIVE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {rental[14]}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Welcome Section */}
      <div className="mt-8 bg-slate-900 rounded-xl p-8 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h2 className="text-xl font-semibold">
              Welcome to DRIVEGO
            </h2>

            <p className="text-slate-300 mt-2">
              Manage your vehicles, customers, rentals and payments
              from one place.
            </p>

          </div>

          <Link
            to="/reports"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition"
          >
            View Reports
            <ArrowRight size={17} />
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;