'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Briefcase } from 'lucide-react'

interface FacultyMember {
    _id: string
    firstName: string
    lastName: string
    email: string
    designation: string
    phoneNumber: string
}

export default function DepartmentMembers() {
    const [members, setMembers] = useState<FacultyMember[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/department-members`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch department members')
            }

            const data = await response.json()
            setMembers(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading members...</div>
    if (error) return <div className="text-red-500">Error: {error}</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Department Faculty</h2>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    Total: {members.length}
                </Badge>
            </div>

            {members.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                        No other faculty members found in your department.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => (
                        <Card key={member._id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`} />
                                    <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">
                                        {member.firstName} {member.lastName}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{member.designation || 'Faculty Member'}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2 text-sm mt-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{member.email}</span>
                                    </div>
                                    {member.phoneNumber && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{member.phoneNumber}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{member.designation || 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
