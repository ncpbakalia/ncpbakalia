'use client';

import {
  CommitteeMember,
  Notice,
  CorrespondenceRecord,
  DisciplinaryCase,
  Meeting,
  TaskItem,
  CivicFeedbackItem,
  ActivityReport,
  AuditLogItem,
  SiteSettings,
} from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_NOTICES,
  INITIAL_CORRESPONDENCE,
  INITIAL_DISCIPLINARY,
  INITIAL_MEETINGS,
  INITIAL_TASKS,
  INITIAL_CIVIC_FEEDBACK,
  INITIAL_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
} from './mock-data';
import { INITIAL_SITE_SETTINGS } from './constants';

const STORAGE_KEYS = {
  MEMBERS: 'ncp_bakalia_members_v1',
  NOTICES: 'ncp_bakalia_notices_v1',
  CORRESPONDENCE: 'ncp_bakalia_correspondence_v1',
  DISCIPLINARY: 'ncp_bakalia_disciplinary_v1',
  MEETINGS: 'ncp_bakalia_meetings_v1',
  TASKS: 'ncp_bakalia_tasks_v1',
  FEEDBACK: 'ncp_bakalia_feedback_v1',
  ACTIVITIES: 'ncp_bakalia_activities_v1',
  AUDIT: 'ncp_bakalia_audit_v1',
  SETTINGS: 'ncp_bakalia_settings_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('ncp_storage_update'));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Committee Members
export function getStoredMembers(): CommitteeMember[] {
  return safeGet<CommitteeMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
}

export function saveStoredMember(member: CommitteeMember): void {
  const list = getStoredMembers();
  const index = list.findIndex((m) => m.id === member.id);
  if (index >= 0) {
    list[index] = member;
  } else {
    list.push(member);
  }
  safeSet(STORAGE_KEYS.MEMBERS, list);
}

export function deleteStoredMember(id: string): void {
  const list = getStoredMembers().filter((m) => m.id !== id);
  safeSet(STORAGE_KEYS.MEMBERS, list);
}

// Notices
export function getStoredNotices(): Notice[] {
  return safeGet<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
}

export function saveStoredNotice(notice: Notice): void {
  const list = getStoredNotices();
  const index = list.findIndex((n) => n.id === notice.id);
  if (index >= 0) {
    list[index] = { ...notice, updated_at: new Date().toISOString() };
  } else {
    list.unshift({ ...notice, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  safeSet(STORAGE_KEYS.NOTICES, list);
}

export function deleteStoredNotice(id: string): void {
  const list = getStoredNotices().filter((n) => n.id !== id);
  safeSet(STORAGE_KEYS.NOTICES, list);
}

export function generateNextNoticeRef(): string {
  const notices = getStoredNotices();
  const currentYear = new Date().getFullYear();
  const count = notices.length + 1;
  const seq = String(count).padStart(3, '0');
  return `NCP/BAKALIA/${currentYear}/${seq}`;
}

// Correspondence
export function getStoredCorrespondence(): CorrespondenceRecord[] {
  return safeGet<CorrespondenceRecord[]>(STORAGE_KEYS.CORRESPONDENCE, INITIAL_CORRESPONDENCE);
}

export function saveStoredCorrespondence(record: CorrespondenceRecord): void {
  const list = getStoredCorrespondence();
  const index = list.findIndex((c) => c.id === record.id);
  if (index >= 0) {
    list[index] = record;
  } else {
    list.unshift(record);
  }
  safeSet(STORAGE_KEYS.CORRESPONDENCE, list);
}

export function generateNextCorrespondenceRef(): string {
  const list = getStoredCorrespondence();
  const currentYear = new Date().getFullYear();
  const count = list.length + 1;
  const seq = String(count).padStart(3, '0');
  return `NCP/BAKALIA/COR/${currentYear}/${seq}`;
}

// Disciplinary Cases (Strictly Confidential)
export function getStoredDisciplinary(): DisciplinaryCase[] {
  return safeGet<DisciplinaryCase[]>(STORAGE_KEYS.DISCIPLINARY, INITIAL_DISCIPLINARY);
}

export function saveStoredDisciplinary(caseItem: DisciplinaryCase): void {
  const list = getStoredDisciplinary();
  const index = list.findIndex((d) => d.id === caseItem.id);
  if (index >= 0) {
    list[index] = { ...caseItem, updated_at: new Date().toISOString() };
  } else {
    list.unshift(caseItem);
  }
  safeSet(STORAGE_KEYS.DISCIPLINARY, list);
}

// Meetings
export function getStoredMeetings(): Meeting[] {
  return safeGet<Meeting[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
}

export function saveStoredMeeting(meeting: Meeting): void {
  const list = getStoredMeetings();
  const index = list.findIndex((m) => m.id === meeting.id);
  if (index >= 0) {
    list[index] = meeting;
  } else {
    list.unshift(meeting);
  }
  safeSet(STORAGE_KEYS.MEETINGS, list);
}

// Tasks
export function getStoredTasks(): TaskItem[] {
  return safeGet<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
}

export function saveStoredTask(task: TaskItem): void {
  const list = getStoredTasks();
  const index = list.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    list[index] = task;
  } else {
    list.unshift(task);
  }
  safeSet(STORAGE_KEYS.TASKS, list);
}

// Civic Feedback
export function getStoredFeedback(): CivicFeedbackItem[] {
  return safeGet<CivicFeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_CIVIC_FEEDBACK);
}

export function saveStoredFeedback(item: CivicFeedbackItem): void {
  const list = getStoredFeedback();
  const index = list.findIndex((f) => f.id === item.id);
  if (index >= 0) {
    list[index] = { ...item, updated_at: new Date().toISOString() };
  } else {
    list.unshift(item);
  }
  safeSet(STORAGE_KEYS.FEEDBACK, list);
}

export function generateNextFeedbackTrackingNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CF-BAK-${currentYear}-${randomSuffix}`;
}

// Activities
export function getStoredActivities(): ActivityReport[] {
  return safeGet<ActivityReport[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
}

export function saveStoredActivity(act: ActivityReport): void {
  const list = getStoredActivities();
  const index = list.findIndex((a) => a.id === act.id);
  if (index >= 0) {
    list[index] = act;
  } else {
    list.unshift(act);
  }
  safeSet(STORAGE_KEYS.ACTIVITIES, list);
}

// Audit Logs
export function getStoredAuditLogs(): AuditLogItem[] {
  return safeGet<AuditLogItem[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
}

export function recordAuditLog(
  action: string,
  entity: string,
  details: string,
  userName: string = 'সদস্য সচিব',
  userRole: string = 'সদস্য সচিব',
  recordId?: string
): void {
  const logs = getStoredAuditLogs();
  const newLog: AuditLogItem = {
    id: `aud-${Date.now()}`,
    action,
    entity,
    record_id: recordId,
    user_name: userName,
    user_role: userRole,
    details,
    ip_address: '103.114.98.12',
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  safeSet(STORAGE_KEYS.AUDIT, logs.slice(0, 100)); // Keep last 100
}

// Site Settings
export function getStoredSettings(): SiteSettings {
  return safeGet<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
}

export function saveStoredSettings(settings: SiteSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}
