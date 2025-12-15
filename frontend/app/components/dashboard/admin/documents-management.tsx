'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import DownloadButton from '@/components/ui/download-button';
import { downloadDocument } from '@/app/utils/downloadHelpers';

interface Document {
    _id: string;
    title: string;
    description: string;
    documentType: string;
    uploadedBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
    department: {
        _id: string;
        name: string;
        code: string;
    };
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    comments?: string;
}

export default function DocumentsManagement() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');

            let endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/all`;

            // If coordinator, fetch department documents
            if (userRole === 'coordinator') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/documents/department`;
            }

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch documents');

            const data = await response.json();
            setDocuments(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getDocumentTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            'achievement': 'bg-purple-100 text-purple-800',
            'research': 'bg-blue-100 text-blue-800',
            'certificate': 'bg-cyan-100 text-cyan-800',
            'report': 'bg-orange-100 text-orange-800',
            'other': 'bg-gray-100 text-gray-800'
        };
        return <Badge className={colors[type] || colors['other']}>{type}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredDocuments = documents.filter(doc => {
        if (filter === 'all') return true;
        return doc.status === filter;
    });

    const stats = {
        total: documents.length,
        pending: documents.filter(d => d.status === 'pending').length,
        approved: documents.filter(d => d.status === 'approved').length,
        rejected: documents.filter(d => d.status === 'rejected').length
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Uploaded Documents</h2>
                    <p className="text-muted-foreground">
                        View and download documents uploaded by faculty and students
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setFilter('pending')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setFilter('approved')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setFilter('rejected')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    All Documents
                </Button>
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </Button>
                <Button
                    variant={filter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setFilter('approved')}
                >
                    Approved
                </Button>
                <Button
                    variant={filter === 'rejected' ? 'default' : 'outline'}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected
                </Button>
            </div>

            {/* Documents Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Documents List</CardTitle>
                    <CardDescription>
                        Showing {filteredDocuments.length} of {documents.length} documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading documents...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No documents found
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Uploaded By</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.map((doc) => (
                                        <TableRow key={doc._id}>
                                            <TableCell>
                                                <div className="font-medium">{doc.title}</div>
                                                {doc.description && (
                                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {doc.description}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{getDocumentTypeBadge(doc.documentType)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {doc.uploadedBy?.firstName || 'Unknown'} {doc.uploadedBy?.lastName || 'User'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {doc.uploadedBy?.role || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {doc.department?.code || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(doc.createdAt)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                            <TableCell>
                                                <DownloadButton
                                                    onDownload={() => downloadDocument(doc._id, doc.title)}
                                                    label="Download"
                                                    size="sm"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
