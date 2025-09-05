'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import useLocalStorage from '@/hooks/use-local-storage';
import { countyData as initialCountyData } from '@/lib/data';
import type { County, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function ChecklistManager() {
  const [allCountyData, setAllCountyData] = useLocalStorage<County[]>('countyData', initialCountyData);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<ChecklistItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [editingText, setEditingText] = useState('');
  const { toast } = useToast();

  const county = allCountyData.find((c) => c.name === selectedCounty);

  const handleUpdate = (updatedCounty: County) => {
    setAllCountyData(allCountyData.map((c) => (c.name === updatedCounty.name ? updatedCounty : c)));
  };

  const handleAddItem = () => {
    if (county && newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: `${county.name.toLowerCase()}_${Date.now()}`,
        text: newItemText.trim(),
        completed: false,
      };
      handleUpdate({ ...county, checklist: [...county.checklist, newItem] });
      setNewItemText('');
      setIsAdding(false);
      toast({ title: 'Success', description: 'Checklist item added.' });
    }
  };

  const handleEditItem = () => {
    if (county && isEditing && editingText.trim()) {
      const updatedChecklist = county.checklist.map((item) =>
        item.id === isEditing.id ? { ...item, text: editingText.trim() } : item
      );
      handleUpdate({ ...county, checklist: updatedChecklist });
      setIsEditing(null);
      setEditingText('');
      toast({ title: 'Success', description: 'Checklist item updated.' });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (county) {
      const updatedChecklist = county.checklist.filter((item) => item.id !== itemId);
      handleUpdate({ ...county, checklist: updatedChecklist });
      toast({ title: 'Success', description: 'Checklist item removed.' });
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Checklist Editor</h2>
            <p className="text-muted-foreground">Select a county to view and edit its permit checklist.</p>
        </div>
        <Select onValueChange={setSelectedCounty}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a County" />
          </SelectTrigger>
          <SelectContent>
            {allCountyData.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {county ? (
        <Card>
          <CardHeader>
            <CardTitle>{county.name} County Checklist</CardTitle>
            <CardDescription>Add, edit, or remove items from this checklist.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {county.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-secondary">
                  <Checkbox id={item.id} disabled />
                  <Label htmlFor={item.id} className="flex-1">{item.text}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsEditing(item);
                      setEditingText(item.text);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" variant="outline" onClick={() => setIsAdding(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border-dashed border-2">
            <p className="text-lg font-semibold text-muted-foreground">Please select a county to begin.</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Checklist Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-item-text">Item Text</Label>
            <Input id="new-item-text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!isEditing} onOpenChange={() => setIsEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-item-text">Item Text</Label>
            <Input id="edit-item-text" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
