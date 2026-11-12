import { ArchiveItem } from './archive';
import { KuaProfile } from './kuaProfile';

export interface BackupSnapshot {
  id: string;
  name: string;
  createdAt: string;
  totalArchives: number;
  archives: ArchiveItem[];
  profile?: KuaProfile;
  createdBy?: string;
  note?: string;
}

export interface BackupPayload {
  app: string;
  version: string;
  exportedAt: string;
  exportedBy: string;
  totalArchives: number;
  archives: ArchiveItem[];
  kuaProfile?: KuaProfile;
}
