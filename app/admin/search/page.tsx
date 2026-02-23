'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Clock,
  Users,
  CheckSquare,
  FileText,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toastNotifications } from '@/app/utils/toast-notifications';

interface SearchResult {
  id: string | number;
  type: 'task' | 'user' | 'document';
  title: string;
  description: string;
  metadata: string;
  date: string;
  link: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample search data
  useEffect(() => {
    const allResults = async () => {
      try {
        const tasksResponse = await fetch('/api/tasks/gettask');
        const usersResponse = await fetch('/api/users/getusers');
        const taskData = await tasksResponse.json();
        const userData = await usersResponse.json();

        const mappedTasks: SearchResult[] = (taskData?.data ?? []).map((task: {
          id: string | number;
          title?: string;
          description?: string;
          status?: string;
          created_at?: string;
        }) => ({
          id: task.id,
          type: 'task',
          title: task.title ?? 'Untitled Task',
          description: task.description ?? 'No description',
          metadata: task.status ?? 'pending',
          date: task.created_at ?? new Date().toISOString(),
          link: `/admin/tasks/${task.id}`,
        }));

        const mappedUsers: SearchResult[] = (userData?.users ?? []).map((user: {
          id: string | number;
          name?: string;
          email?: string;
          role?: string;
          created_at?: string;
        }) => ({
          id: user.id,
          type: 'user',
          title: user.name ?? user.email ?? 'Unnamed User',
          description: user.email ?? 'No email',
          metadata: user.role ?? 'user',
          date: user.created_at ?? new Date().toISOString(),
          link: `/admin/users/${user.id}`,
        }));

        setAllResults([...mappedTasks, ...mappedUsers]);
      } catch (error) {
        console.error('Error fetching all results:', error);
        toastNotifications.error.fetchFailed('search results');
      }
    };

    allResults();
  }, []);

  const runSearch = (queryText: string, type: string) => {
    let filtered = allResults;

    const query = queryText.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (result) =>
          result.title.toLowerCase().includes(query) ||
          result.description.toLowerCase().includes(query)
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter((result) => result.type === type);
    }

    setResults(filtered);
  };

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setHasSearched(true);
    setIsSearching(true);

    const timer = window.setTimeout(() => {
      runSearch(query, searchType);
      setIsSearching(false);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, searchType, allResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      toastNotifications.error.validation('Please enter a search query');
      return;
    }

    setHasSearched(true);
    setIsSearching(false);
    runSearch(query, searchType);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchType('all');
    setResults([]);
    setHasSearched(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-5 w-5 text-indigo-500" />;
      case 'user':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-gray-500">
          Find tasks, users, and documents across the platform
        </p>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for tasks, users, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
                autoFocus
              />
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">
                  Search Type
                </label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="task">Tasks</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="gap-2" disabled={isSearching}>
                  <Search size={18} />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
                {hasSearched && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleClear}
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          {/* Results Summary */}
          <div>
            {results.length > 0 ? (
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold">{results.length}</span>{' '}
                result{results.length !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold">{searchQuery}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                No results found for{' '}
                <span className="font-semibold">{searchQuery}</span>
              </p>
            )}
          </div>

          {/* Results Grid */}
          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <Link key={result.id} href={result.link}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex gap-4 items-start">
                        {/* Icon */}
                        <div className="mt-1">{getTypeIcon(result.type)}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">
                              {result.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={getTypeBadgeColor(result.type)}
                            >
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={14} />
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {result.metadata}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Try adjusting your search terms or filters. Make sure all words
                  are spelled correctly.
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Enter keywords to search across all tasks, users, and documents in
              your workspace.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
