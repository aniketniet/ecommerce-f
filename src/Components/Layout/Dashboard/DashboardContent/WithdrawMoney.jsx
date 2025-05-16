import React from "react";

const walletData = {
  totalIncome: 15000,
  totalReceived: 12000,
  totalBalance: 3000,
  history: [
    { id: 1, name: "Rahul Sharma", amount: 5000, date: "2025-05-10" },
    { id: 2, name: "Anjali Verma", amount: 2000, date: "2025-05-11" },
    { id: 3, name: "Vikas Mehta", amount: 3000, date: "2025-05-12" },
    { id: 4, name: "Sneha Gupta", amount: 2000, date: "2025-05-13" },
  ],
};

const WithdrawMoney = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wallet</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">₹{walletData.totalIncome}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Received</h2>
          <p className="text-2xl font-bold text-blue-600">₹{walletData.totalReceived}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Avilable Balance</h2>
          <p className="text-2xl font-bold text-purple-600">₹{walletData.totalBalance}</p>
        </div>
      </div>

      {/* Wallet History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Wallet History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {walletData.history.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">₹{item.amount}</td>
                  <td className="py-3 px-4">{item.date}</td>
                </tr>
              ))}
              {walletData.history.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawMoney;
