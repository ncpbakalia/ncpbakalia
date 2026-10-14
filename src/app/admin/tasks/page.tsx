'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredTasks,
  saveStoredTask,
  getStoredMembers,
  recordAuditLog,
} from '@/lib/storage';
import { TaskItem, TaskPriority, TaskStatus } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  X,
  Save,
  Search,
  Filter,
} from 'lucide-react';

export default function AdminTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    refreshList();
    setMembers(getStoredMembers());
  }, []);

  const refreshList = () => {
    setTasks(getStoredTasks());
  };

  const handleOpenAdd = () => {
    setEditingTask({
      id: `tsk-${Date.now()}`,
      title: '',
      description: '',
      assigned_to_name: members[0]?.name_bn || 'ইঞ্জিনিয়ার তানভীর আহমেদ',
      assigned_to_id: members[0]?.id || 'mem-004',
      priority: 'মধ্যম (Medium)',
      start_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'চলমান',
      progress_percent: 0,
      reviewer_name: user?.name || 'মোঃ আরিফ মাঈনুদ্দীন',
      updates: [],
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (t: TaskItem) => {
    setEditingTask({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title) {
      alert('টাস্কের শিরোনাম আবশ্যক');
      return;
    }

    saveStoredTask(editingTask);
    recordAuditLog(
      'SAVE_TASK',
      'tasks',
      `দায়িত্ব বণ্টন সংরক্ষণ: ${editingTask.title} (${editingTask.status})`,
      user?.name,
      user?.position_bn,
      editingTask.id
    );

    setIsModalOpen(false);
    setEditingTask(null);
    refreshList();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="সাংগঠনিক দায়িত্ব ও কর্মবণ্টন (Task Tracking)"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির মাঠ পর্যায়ের দায়িত্ব, অগ্রগতি পর্যবেক্ষণ ও সময়সীমা ব্যবস্থাপনা"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="দায়িত্বের শিরোনাম বা দায়িত্বপ্রাপ্ত ব্যক্তি খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
              >
                <option value="all">সকল অবস্থা (Status)</option>
                <option value="চলমান">চলমান</option>
                <option value="অপেক্ষমান">অপেক্ষমান</option>
                <option value="বিলম্বিত">বিলম্বিত (Overdue)</option>
                <option value="সম্পন্ন">সম্পন্ন</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সাংগঠনিক দায়িত্ব অর্পণ</span>
            </button>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4 hover:border-[#075E3B]/40 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        t.priority.includes('High')
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {t.priority}
                    </span>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        t.status === 'সম্পন্ন'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : t.status === 'বিলম্বিত'
                          ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug">{t.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs text-gray-600 font-semibold">
                    <span>অগ্রগতি (Progress)</span>
                    <span className="font-mono text-[#075E3B]">
                      {toBengaliDigits(t.progress_percent)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        t.progress_percent === 100
                          ? 'bg-emerald-600'
                          : t.status === 'বিলম্বিত'
                          ? 'bg-red-500'
                          : 'bg-[#075E3B]'
                      }`}
                      style={{ width: `${t.progress_percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Assignee & Dates */}
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 font-medium text-gray-800">
                      <User className="w-3.5 h-3.5 text-[#075E3B]" />
                      <span>{t.assigned_to_name}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>শেষ সময়: {formatBengaliDate(t.due_date)}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px]">পর্যালোচক: {t.reviewer_name}</span>
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-xs font-bold text-[#075E3B] hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer"
                    >
                      অগ্রগতি আপডেট
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="col-span-2 bg-white rounded-2xl p-10 text-center text-gray-500 text-xs">
                কোনো দায়িত্ব অর্পণের তথ্য পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Modal */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">সাংগঠনিক দায়িত্ব বণ্টন ও আপডেট</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">কাজের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">কাজের বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">দায়িত্বপ্রাপ্ত সদস্য</label>
                  <select
                    value={editingTask.assigned_to_name}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, assigned_to_name: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name_bn}>
                        {m.name_bn} ({m.position_bn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অগ্রাধিকার (Priority)</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: e.target.value as TaskPriority,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="সাধারণ (Normal)">সাধারণ (Normal)</option>
                    <option value="মধ্যম (Medium)">মধ্যম (Medium)</option>
                    <option value="উচ্চ (High)">উচ্চ (High)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">শেষ সময়সীমা</label>
                  <input
                    type="date"
                    value={editingTask.due_date}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, due_date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">স্ট্যাটাস</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="চলমান">চলমান</option>
                    <option value="অপেক্ষমান">অপেক্ষমান</option>
                    <option value="পর্যালোচনাধীন">পর্যালোচনাধীন</option>
                    <option value="বিলম্বিত">বিলম্বিত</option>
                    <option value="সম্পন্ন">সম্পন্ন</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    অগ্রগতি শতাংশ ({editingTask.progress_percent}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingTask.progress_percent}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        progress_percent: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
