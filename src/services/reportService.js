const API_BASE_URL = 'http://localhost:5000/api';

export const reportService = {
  async createReport(reportData) {
    try {
      console.log('Sending report to backend...', {
        title: reportData.title,
        category: reportData.category,
        imageLength: reportData.image ? reportData.image.length : 0,
        imageStartsWith: reportData.image ? reportData.image.substring(0, 20) + '...' : 'NO IMAGE'
      });

      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Report created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Other methods remain the same...
  async getReports(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/reports?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  async getReportById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }
};
