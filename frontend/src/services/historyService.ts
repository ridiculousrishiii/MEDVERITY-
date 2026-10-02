import { VerificationResult } from '../types';
import { verificationService } from './verificationService';

export const historyService = {
  async getAll(): Promise<VerificationResult[]> {
    return await verificationService.getStoredVerifications();
  },

  async deleteItem(id: string): Promise<VerificationResult[]> {
    const list = await this.getAll();
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem('medverity_history_verifications', JSON.stringify(updated));
    return updated;
  },

  async clearAll(): Promise<void> {
    localStorage.setItem('medverity_history_verifications', JSON.stringify([]));
  },

  exportAsJson(items: VerificationResult[]): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medverity_history_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportAsCsv(items: VerificationResult[]): void {
    const headers = ['ID', 'Query', 'Timestamp', 'Category', 'Verdict', 'Confidence Score', 'Summary'];
    const rows = items.map((item) => [
      `"${item.id}"`,
      `"${item.query.replace(/"/g, '""')}"`,
      `"${item.timestamp}"`,
      `"${item.category}"`,
      `"${item.verdict}"`,
      `"${item.confidenceScore}%"`,
      `"${item.executiveSummary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medverity_evidence_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
