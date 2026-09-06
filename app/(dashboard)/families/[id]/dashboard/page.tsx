'use client'

import { useEffect, useState } from 'react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface DashboardPageProps {
  params: Promise<{ id: string }>
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [familyId, setFamilyId] = useState<string>('')
  const [data, setData] = useState<any>(null)
  const { getDashboardData, loading, error } = useDashboardData()

  useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  useEffect(() => {
    if (!familyId) return

    const loadData = async () => {
      const result = await getDashboardData(familyId)
      if (result?.data) {
        setData(result.data)
      }
    }

    loadData()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Family financial overview</p>
        </div>

        {/* Finance Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Financial Summary</h2>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.finance?.totalIncome || 0)}
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Expense</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.finance?.totalExpense || 0)}
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.finance?.balance || 0)}
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.finance?.thisMonthExpense || 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Assets & Debts */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Assets</h2>
            {loading ? (
              <CardSkeleton />
            ) : (
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.assets?.totalValue || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {data?.assets?.count || 0} assets
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Debts</h2>
            {loading ? (
              <CardSkeleton />
            ) : (
              <div className="p-6 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(data?.debts?.totalAmount || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {data?.debts?.count || 0} active debts
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Goals ({data?.goals?.count || 0})</h2>
          {loading ? (
            <TableSkeleton />
          ) : data?.goals?.active?.length > 0 ? (
            <div className="space-y-3">
              {data.goals.active.map((goal: any) => {
                const progress = calculateProgress(goal.current_amount, goal.target_amount)
                return (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{goal.name}</h4>
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(goal.current_amount)}</span>
                      <span>{formatCurrency(goal.target_amount)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">No active goals</p>
              <Link href={`/goals`} className="text-primary hover:underline text-sm mt-2 inline-block">
                Create a goal
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming Events ({data?.events?.count || 0})</h2>
          {loading ? (
            <TableSkeleton />
          ) : data?.events?.upcoming?.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">Event</th>
                    <th className="text-left p-4 text-sm font-medium">Date</th>
                    <th className="text-left p-4 text-sm font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.upcoming.map((event: any) => (
                    <tr key={event.id} className="border-t">
                      <td className="p-4">{event.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(event.start_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {event.location || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  )
}
