'use client';

import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Eye, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastNotifications } from '@/app/utils/toast-notifications';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
  priority?: string;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks/gettask');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toastNotifications.error.fetchFailed('tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTaskDateKey = (dueDate: string | null) => {
    if (!dueDate) return null;
    return dueDate.split('T')[0] ?? null;
  };

  const taskDates = Array.from(
    new Set(
      tasks
        .map((task) => getTaskDateKey(task.due_date))
        .filter((key): key is string => Boolean(key))
    )
  ).map((key) => {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  const selectedDateTasks = selectedDate
    ? tasks.filter((task) => getTaskDateKey(task.due_date) === formatDateKey(selectedDate))
    : [];

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    toastNotifications.info.generic(`Navigated to ${monthName}`);
  };

  return (
    <div className="space-y-6 p-8 max-w-5xl mx-auto">
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Task Calendar</h1>
        <p className="text-sm text-indigo-100 mt-2">Tasks with due dates are highlighted on the calendar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              modifiers={{ hasTask: taskDates }}
              modifiersClassNames={{
                hasTask: 'bg-blue-100 text-blue-900 font-semibold',
              }}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate
                ? selectedDate.toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-gray-600">Loading tasks...</p>
            ) : selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div key={task.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{task.title}</p>
                  <Button variant="ghost" size="icon" onClick={()=>{window.location.href = `/admin/tasks/${task.id}`}}>
                  <Eye size={16} className="inline-block mr-1 text-gray-500" />
                  </Button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {task.status}
                      </Badge>
                      {task.priority && (
                        <Badge variant="outline" className="capitalize">
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No tasks for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">
            {tasks.filter((task) => task.due_date).length} task(s) with due dates are shown on the calendar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
