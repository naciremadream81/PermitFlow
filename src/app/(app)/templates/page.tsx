import { Header } from '@/components/Header';
import { TemplateManager } from '@/components/TemplateManager';

export default function TemplatesPage() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="PDF Templates"
        description="Manage PDF forms for automated population."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <TemplateManager />
      </main>
    </div>
  );
}
