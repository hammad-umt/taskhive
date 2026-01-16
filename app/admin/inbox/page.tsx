'use client';

import { useState } from 'react';
import { Trash2, Star, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toastNotifications } from '@/app/utils/toast-notifications';

interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  avatar: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        id: 1,
        sender: 'Ahmed Khan',
        subject: 'Project Update Required',
        preview: 'Please provide the latest status on the Q1 project deliverables...',
        timestamp: '2 hours ago',
        read: false,
        starred: true,
        avatar: 'AK',
      },
      {
        id: 2,
        sender: 'Fatima Ali',
        subject: 'Team Meeting Scheduled',
        preview: 'Hi, the team meeting has been rescheduled to Wednesday at 3 PM...',
        timestamp: '4 hours ago',
        read: false,
        starred: false,
        avatar: 'FA',
      },
      {
        id: 3,
        sender: 'Hassan Malik',
        subject: 'Code Review Feedback',
        preview: 'Great work on the latest PR! I have some suggestions for optimization...',
        timestamp: '1 day ago',
        read: true,
        starred: false,
        avatar: 'HM',
      },
      {
        id: 4,
        sender: 'Zainab Hassan',
        subject: 'Budget Approval Pending',
        preview: 'Your budget request for Q2 is awaiting final approval. Please review...',
        timestamp: '2 days ago',
        read: true,
        starred: true,
        avatar: 'ZH',
      },
      {
        id: 5,
        sender: 'Ali Raza',
        subject: 'System Maintenance Notice',
        preview: 'We will be performing scheduled maintenance on all systems this weekend...',
        timestamp: '3 days ago',
        read: true,
        starred: false,
        avatar: 'AR',
      },
    ]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const toggleStar = (id: number) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg)));
    toastNotifications.info.generic('Starred updated');
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    toastNotifications.success.deleted('Message');
  };

  const markAsRead = (id: number) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)));
    toastNotifications.info.generic('Marked as read');
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card className="overflow-hidden">
        {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Inbox</h1>
              <p className="text-blue-100 mt-1">{unreadCount} unread messages</p>
            </div>
            <div className="bg-white text-indigo-600 rounded-full px-4 py-2 font-bold text-lg">
              {messages.length}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="divide-y">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message.id);
                  markAsRead(message.id);
                }}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                  !message.read ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'bg-white'
                } ${selectedMessage === message.id ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold">
                      {message.avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold text-gray-900 ${!message.read ? 'text-lg' : ''}`}>
                        {message.sender}
                      </h3>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{message.timestamp}</span>
                    </div>
                    <p className={`text-sm ${!message.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">{message.preview}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className={`p-2 rounded hover:bg-gray-200 transition-all ${
                        message.starred ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-2 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No messages found</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 p-4 flex justify-between text-sm text-gray-600 border-t">
          <span>Total: {messages.length} messages</span>
          <span>Unread: {unreadCount} messages</span>
          <span>Starred: {messages.filter((m) => m.starred).length} messages</span>
        </div>
      </Card>
    </div>
  );
}
