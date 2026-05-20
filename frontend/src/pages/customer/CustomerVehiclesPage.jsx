import { useState } from 'react';
import { Car, Loader, Fuel, Gauge } from 'lucide-react';
import { useUserVehicles } from '@/hooks/useVehicles';
import Header from '@/components/Header';

const STATUS_BADGES = {
  Active: 'bg-green-100 text-green-800 border-green-200',
  Inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  UnderMaintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Decommissioned: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS = {
  Active: 'Active',
  Inactive: 'Inactive',
  UnderMaintenance: 'Under Maintenance',
  Decommissioned: 'Decommissioned',
};

const FUEL_LABELS = {
  Petrol: 'Petrol',
  Diesel: 'Diesel',
  Electric: 'Electric',
};

const COLOR_MAP = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Green: 'bg-green-500',
  Black: 'bg-gray-900',
  White: 'bg-white border border-gray-300',
  Silver: 'bg-gray-400',
  Gray: 'bg-gray-500',
};

export default function CustomerVehiclesPage() {
  const { data: vehicles, isLoading, error } = useUserVehicles();

  const vehicleList = vehicles || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="My Vehicles"
        desc="View all your registered vehicles"
        buttonText=""
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-600 font-medium">
              Error: {error.message || 'Failed to load vehicles'}
            </p>
          </div>
        ) : vehicleList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Vehicles Registered
            </h3>
            <p className="text-slate-500">
              Your vehicles will appear here once they are registered by staff.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleList.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-slate-800 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-slate-400 text-xs font-mono">
                        {vehicle.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      STATUS_BADGES[vehicle.status] || STATUS_BADGES['Active']
                    }`}
                  >
                    {STATUS_LABELS[vehicle.status] || vehicle.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  {/* Year & Color */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Year</span>
                    <span className="font-medium text-slate-800">
                      {vehicle.year || '—'}
                    </span>
                  </div>

                  {/* Fuel Type */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5" /> Fuel
                    </span>
                    <span className="font-medium text-slate-800">
                      {FUEL_LABELS[vehicle.fuelType] || vehicle.fuelType || '—'}
                    </span>
                  </div>

                  {/* Mileage */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" /> Mileage
                    </span>
                    <span className="font-medium text-slate-800">
                      {vehicle.mileageKm
                        ? `${vehicle.mileageKm.toLocaleString()} km`
                        : '—'}
                    </span>
                  </div>

                  {/* Color */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Color</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          COLOR_MAP[vehicle.color] || 'bg-gray-300'
                        }`}
                      />
                      <span className="font-medium text-slate-800">
                        {vehicle.color || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-slate-100" />

                  {/* Chassis & Engine */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 uppercase tracking-wide">Chassis</span>
                      <span className="font-mono text-slate-600">
                        {vehicle.chassisNumber || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 uppercase tracking-wide">Engine</span>
                      <span className="font-mono text-slate-600">
                        {vehicle.engineNumber || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
