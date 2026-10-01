import { useState } from 'react';
import { User, Check, Loader2 } from 'lucide-react';
import { usersAPI } from '../lib/api';
import type { User as UserType } from '../types';

interface SettingsProps {
  user: UserType | null;
  onUpdate: () => void;
}

export default function Settings({ user, onUpdate }: SettingsProps) {
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile({
        bio: bio.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });
      onUpdate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
            Account Settings
          </h1>
          <p className="text-xs text-white/40">
            Customize your public profile, bio, and avatar
          </p>
        </div>

        <div className="apple-glass p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          {/* Avatar Preview */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2 pl-1">
              Profile Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#181922] border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl('')}
                  />
                ) : (
                  <User className="w-7 h-7 text-white/40" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 text-xs outline-none focus:border-white/30 transition-all font-normal"
                />
                <p className="text-[11px] text-white/30 mt-1 pl-1">Direct image URL</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5 pl-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Bio & Gaming Taste
              </label>
              <span className="text-[11px] text-white/30">{bio.length}/300</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={4}
              placeholder="Tell others what platforms and genres you enjoy..."
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-all resize-none font-normal"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-full font-semibold text-xs tracking-wide shadow-[0_4px_25px_rgba(255,255,255,0.15)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Profile Updated!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
