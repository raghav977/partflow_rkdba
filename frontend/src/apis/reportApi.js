import api from "@/lib/api";

const reportApi = {
  // Financial Reports
  getDailyFinancialReport: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/Report/financial/daily', { params });
    return response.data;
  },

  getMonthlyFinancialReport: async (year = null, month = null) => {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await api.get('/Report/financial/monthly', { params });
    return response.data;
  },

  getYearlyFinancialReport: async (year = null) => {
    const params = year ? { year } : {};
    const response = await api.get('/Report/financial/yearly', { params });
    return response.data;
  },

  // Customer Reports
  getRegularCustomers: async (minPurchases = 5) => {
    const response = await api.get('/Report/customers/regular', {
      params: { minPurchases }
    });
    return response.data;
  },

  getHighSpenders: async (minSpent = 50000) => {
    const response = await api.get('/Report/customers/high-spenders', {
      params: { minSpent }
    });
    return response.data;
  },

  getPendingCredits: async (daysOverdue = 30) => {
    const response = await api.get('/Report/customers/pending-credits', {
      params: { daysOverdue }
    });
    return response.data;
  },

  getCustomerReport: async () => {
    const response = await api.get('/Report/customers');
    return response.data;
  },

  // Inventory Reports
  getLowStockParts: async (threshold = 10) => {
    const response = await api.get('/Report/inventory/low-stock', {
      params: { threshold }
    });
    return response.data;
  },

  // Credit Reminders
  sendCreditReminders: async (daysOverdue = 30) => {
    const response = await api.post('/Report/send-credit-reminders', null, {
      params: { daysOverdue }
    });
    return response.data;
  }
};

export default reportApi;
