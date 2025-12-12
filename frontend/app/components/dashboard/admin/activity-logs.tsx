'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, User, FileText, Trash2, Edit, Plus, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityLog {
    _id: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
    userName: string;
    userRole: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: string;
    entityId: string;
    details: any;
    timestamp: string;
}

interface ActivityStats {
    totalLogs: number;
    byAction: Array<{ _id: string; count: number }>;
    byEntityType: Array<{ _id: string; count: number }>;
    byUserRole: Array<{ _id: string; count: number }>;
}

export default function ActivityLogsManagement() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
    const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 50;

    useEffect(() => {
        fetchActivityLogs();
        fetchActivityStats();
    }, [currentPage, actionFilter, entityTypeFilter, userRoleFilter, startDate, endDate]);

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString()
            });

            if (actionFilter !== 'all') params.append('action', actionFilter);
            if (entityTypeFilter !== 'all') params.append('entityType', entityTypeFilter);
            if (userRoleFilter !== 'all') params.append('userRole', userRoleFilter);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/activity-logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch activity logs');

            const data = await response.json();
            setLogs(data.logs);
            setTotalPages(data.pagination.totalPages);
            setTotalCount(data.pagination.totalCount);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityStats = async () => {
        try {
            const token = localStorage.getItem('token');

            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/activity-logs/stats?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch stats');

            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <Plus className="h-4 w-4" />;
            case 'UPDATE': return <Edit className="h-4 w-4" />;
            case 'DELETE': return <Trash2 className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-800 border-green-300';
            case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'DELETE': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'coordinator': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'faculty': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const resetFilters = () => {
        setActionFilter('all');
        setEntityTypeFilter('all');
        setUserRoleFilter('all');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
                    <p className="text-muted-foreground">
                        Track all user activities and changes in the system
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalLogs}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Creates</CardTitle>
                            <Plus className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.byAction.find(a => a._id === 'CREATE')?.count || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Updates</CardTitle>
                            <Edit className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.byAction.find(a => a._id === 'UPDATE')?.count || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Deletes</CardTitle>
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.byAction.find(a => a._id === 'DELETE')?.count || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Action</label>
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="CREATE">Create</SelectItem>
                                    <SelectItem value="UPDATE">Update</SelectItem>
                                    <SelectItem value="DELETE">Delete</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Entity Type</label>
                            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="ResearchPublication">Research Publication</SelectItem>
                                    <SelectItem value="ProfessionalDevelopment">Professional Development</SelectItem>
                                    <SelectItem value="CourseTaught">Course Taught</SelectItem>
                                    <SelectItem value="EventOrganized">Event Organized</SelectItem>
                                    <SelectItem value="InstitutionalEvent">Institutional Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">User Role</label>
                            <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="faculty">Faculty</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>
                        Showing {logs.length} of {totalCount} activities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading activity logs...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No activity logs found
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Entity Type</TableHead>
                                            <TableHead>Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <TableRow key={log._id}>
                                                <TableCell className="font-mono text-sm">
                                                    {formatDate(log.timestamp)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getActionColor(log.action)} flex items-center gap-1 w-fit`}>
                                                        {getActionIcon(log.action)}
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : log.userName}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {log.user?.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getRoleColor(log.userRole)}>
                                                        {log.userRole}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {log.entityType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm max-w-xs truncate">
                                                        {log.details?.title || log.details?.courseName || log.details?.eventName || log.details?.email || 'N/A'}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
