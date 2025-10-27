
import { Header } from '@/components/Header';
import { FileUploadManager } from '@/components/FileUploadManager';

export default function UploadsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="Upload Permit Package"
        description="Upload and categorize all documents for a new permit package."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <FileUploadManager />
      </main>
    </div>
  );
}
