'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AssignmentFormData {
  taskId: string;
  assignee: string;
  dueDate: string;
  notes: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  currentAssignee?: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  department: string;
  tasksCount: number;
}

export default function AssignTaskPage() {
  const [formData, setFormData] = useState<AssignmentFormData>({
    taskId: '',
    assignee: '',
    dueDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sample tasks data
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Complete project documentation',
      status: 'pending',
      priority: 'high',
      currentAssignee: 'John Doe',
    },
    {
      id: 2,
      title: 'Fix login bug',
      status: 'pending',
      priority: 'critical',
      currentAssignee: 'Jane Smith',
    },
    {
      id: 3,
      title: 'Database optimization',
      status: 'in-progress',
      priority: 'high',
    },
    {
      id: 4,
      title: 'User feedback implementation',
      status: 'pending',
      priority: 'low',
    },
    {
      id: 5,
      title: 'API endpoint testing',
      status: 'pending',
      priority: 'medium',
    },
  ];

  // Sample team members
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Backend',
      tasksCount: 5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'Frontend',
      tasksCount: 4,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      department: 'Design',
      tasksCount: 3,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      department: 'DevOps',
      tasksCount: 6,
    },
    {
      id: 5,
      name: 'Tom Brown',
      email: 'tom@example.com',
      department: 'QA',
      tasksCount: 2,
    },
  ];

  const handleTaskChange = (taskId: string) => {
    setFormData((prev) => ({
      ...prev,
      taskId,
    }));
    const task = tasks.find((t) => t.id === parseInt(taskId));
    setSelectedTask(task || null);
    if (errors.taskId) {
      setErrors((prev) => ({
        ...prev,
        taskId: '',
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskId) {
      newErrors.taskId = 'Please select a task';
    }
    if (!formData.assignee) {
      newErrors.assignee = 'Please select a team member';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Task assigned:', formData);
      // In a real app, you would redirect here
      // redirect('/admin/tasks');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAssignee = () => {
    return teamMembers.find((m) => m.name === formData.assignee);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assign Task</h1>
          <p className="text-gray-500">
            Assign tasks to team members
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Assign a task to a team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Task */}
                <div className="space-y-2">
                  <Label htmlFor="taskId">Select Task</Label>
                  <Select
                    value={formData.taskId}
                    onValueChange={handleTaskChange}
                  >
                    <SelectTrigger id="taskId">
                      <SelectValue placeholder="Choose a task to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem
                          key={task.id}
                          value={task.id.toString()}
                        >
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.taskId && (
                    <p className="text-sm text-red-500">{errors.taskId}</p>
                  )}
                </div>

                {/* Task Details Preview */}
                {selectedTask && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Selected Task
                      </h4>
                      <p className="font-semibold">{selectedTask.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(selectedTask.status)}
                      >
                        {selectedTask.status.replace('-', ' ')}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(selectedTask.priority)}
                      >
                        {selectedTask.priority}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Select Assignee */}
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select
                    value={formData.assignee}
                    onValueChange={(value) =>
                      handleSelectChange('assignee', value)
                    }
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          <div className="flex items-center gap-2">
                            {member.name} • {member.department}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assignee && (
                    <p className="text-sm text-red-500">{errors.assignee}</p>
                  )}
                </div>

                {/* Assignee Details */}
                {formData.assignee && getAssignee() && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-600" />
                      <span className="font-semibold">
                        {getAssignee()?.name}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{' '}
                        {getAssignee()?.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Department:</span>{' '}
                        {getAssignee()?.department}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Current Tasks:</span>{' '}
                        {getAssignee()?.tasksCount}
                      </p>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={`pl-10 ${
                        errors.dueDate ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="text-sm text-red-500">{errors.dueDate}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Assignment Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes for the assignee..."
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Link href="/admin/tasks" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Assigning...' : 'Assign Task'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {teamMembers.length} members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      formData.assignee === member.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      handleSelectChange('assignee', member.name)
                    }
                  >
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {member.department}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {member.tasksCount} tasks
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
