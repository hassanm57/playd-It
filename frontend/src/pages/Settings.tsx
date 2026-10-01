import { useState } from 'react';
import { usersAPI } from '../lib/api';
import type { User } from '../types';

interface SettingsProps {
  user: User | null;
  onUpdate: () => void;
}

export default function Settings({ user, onUpdate }: SettingsProps) {
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile({ bio });
      onUpdate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-muted block mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full p-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted outline-none focus:border-border-light resize-none transition-colors text-sm"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-text-muted mt-1">{bio.length}/300</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
