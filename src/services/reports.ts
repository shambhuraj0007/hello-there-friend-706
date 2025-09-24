export interface BackendReport {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    address: string;
    coordinates?: { latitude?: number; longitude?: number; lat?: number; lng?: number };
  };
  image?: { url?: string; publicId?: string };
  reportedAt?: string;
  createdAt?: string;
}

export interface FrontendIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  location: string;
  image?: string;
  createdAt: string;
  credits?: number;
}

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

function mapStatus(status: BackendReport['status']): FrontendIssue['status'] {
  if (!status) return 'pending';
  return status.replace('-', '_') as FrontendIssue['status'];
}

function mapReportToIssue(report: BackendReport): FrontendIssue {
  return {
    id: report._id,
    title: report.title,
    description: report.description,
    category: report.category,
    status: mapStatus(report.status),
    location: report.location?.address || 'Unknown',
    image: report.image?.url,
    createdAt: report.reportedAt || report.createdAt || new Date().toISOString(),
  };
}

export async function fetchRecentReports(limit = 5): Promise<FrontendIssue[]> {
  const url = `${API_BASE}/reports/recent?limit=${encodeURIComponent(String(limit))}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch recent reports: ${res.status}`);
  }
  const data = await res.json();
  if (!data?.success) {
    throw new Error(data?.message || 'Unknown error from server');
  }
  const reports: BackendReport[] = data.data || [];
  return reports.map(mapReportToIssue);
}
