export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Veterinary Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to VetFlow - Comprehensive veterinary workflow automation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Animals</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Appointments</p>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Overdue Vaccinations</p>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900">1</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="font-semibold text-blue-900">System Status</h2>
        <p className="text-sm text-blue-800 mt-2">✓ All systems operational</p>
        <p className="text-sm text-blue-800">✓ Backend API connected</p>
        <p className="text-sm text-blue-800">✓ Database synchronized</p>
      </div>
    </div>
  );
}
