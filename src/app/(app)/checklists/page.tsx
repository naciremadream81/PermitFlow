import { Header } from '@/components/Header';
import { ChecklistManager } from '@/components/ChecklistManager';

export default function ChecklistsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="County Checklists"
        description="Customize permit checklists for each county."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <ChecklistManager />
      </main>
    </div>
  );
}
