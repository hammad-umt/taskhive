'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toastNotifications } from '@/app/utils/toast-notifications';

interface CalendarEvent {
  date: number;
  title: string;
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [events] = useState<CalendarEvent[]>([
    { date: 5, title: 'Team Meeting', color: 'bg-blue-100' },
    { date: 12, title: 'Project Deadline', color: 'bg-red-100' },
    { date: 18, title: 'Review Session', color: 'bg-green-100' },
    { date: 25, title: 'Planning', color: 'bg-yellow-100' },
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    toastNotifications.info.generic(`Navigated to ${monthName}`);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    toastNotifications.info.generic(`Navigated to ${monthName}`);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  const getEventForDate = (day: number) => {
    return events.find((event) => event.date === day);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Calendar Demo</h1>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">{monthName}</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square bg-gray-50 rounded" />
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const event = getEventForDate(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg p-2 border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isToday
                    ? 'border-blue-500 bg-blue-50'
                    : event
                      ? `${event.color} border-gray-200`
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {event && (
                    <p className="text-xs font-semibold text-gray-700 mt-1 line-clamp-2">{event.title}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold mb-3">Events</h3>
          <div className="grid grid-cols-2 gap-3">
            {events.map((event, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${event.color}`} />
                <span className="text-sm">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
