import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getActiveAnnouncements, Announcement } from "@/lib/announcements";

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const data = await getActiveAnnouncements();
    setAnnouncements(data);
  };

  const dismissAnnouncement = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-primary/10 text-primary border border-primary/20 px-4 py-3 text-sm font-medium shadow-soft animate-in slide-in-from-top-2 duration-300"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="font-semibold">{announcement.title}: </span>
              {announcement.message}
            </div>
            <button
              onClick={() => dismissAnnouncement(announcement.id)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}