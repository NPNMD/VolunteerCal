import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { profilesService } from '@/services/profiles.service';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { DependentsList } from '@/components/profile/DependentsList';
import type { Dependent } from '@/types';

export function ProfilePage() {
  const { user, profile, loadProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [dependents, setDependents] = useState<Dependent[]>([]);

  useEffect(() => {
    if (user) {
      profilesService.getDependents(user.id).then(setDependents).catch(() => {});
    }
  }, [user]);

  const handleSave = async (updates: Record<string, unknown>) => {
    if (!user) return;
    await profilesService.updateProfile(user.id, updates as any);
    await loadProfile();
    setEditing(false);
  };

  const handleAddDependent = async (dep: { name: string; age?: number; notes?: string }) => {
    if (!user) return;
    const newDep = await profilesService.addDependent(user.id, dep);
    setDependents(prev => [...prev, newDep]);
  };

  const handleDeleteDependent = async (id: string) => {
    await profilesService.deleteDependent(id);
    setDependents(prev => prev.filter(d => d.id !== id));
  };

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {editing ? (
        <ProfileForm profile={profile} onSave={handleSave} onCancel={() => setEditing(false)} />
      ) : (
        <ProfileCard profile={profile} isOwn onEdit={() => setEditing(true)} />
      )}

      <DependentsList dependents={dependents} onAdd={handleAddDependent} onDelete={handleDeleteDependent} />
    </div>
  );
}
