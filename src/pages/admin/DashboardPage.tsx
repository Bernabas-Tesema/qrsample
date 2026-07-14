import { useEffect, useState } from 'react';
import { Grid3X3, UtensilsCrossed, CheckCircle, XCircle, Activity } from 'lucide-react';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Card, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { SOBANA_RESTAURANT_ID, getDashboardStats, getRecentActivity } from '@/services/api';
import { formatRelativeTime } from '@/utils';
import type { DashboardStats, ActivityLog } from '@/types';

export function DashboardPage() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id || SOBANA_RESTAURANT_ID;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const s = await getDashboardStats(restaurantId);
        setStats(s);
      } catch {
        setStats({ totalCategories: 0, totalMenuItems: 0, availableItems: 0, unavailableItems: 0 });
      }

      try {
        const a = await getRecentActivity(restaurantId);
        setActivity(a);
      } catch {
        setActivity([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [restaurantId]);

  const statCards = [
    { label: 'Total Categories', value: stats?.totalCategories ?? 0, icon: Grid3X3, color: 'text-primary bg-primary/10' },
    { label: 'Total Menu Items', value: stats?.totalMenuItems ?? 0, icon: UtensilsCrossed, color: 'text-blue-600 bg-blue-50' },
    { label: 'Available Items', value: stats?.availableItems ?? 0, icon: CheckCircle, color: 'text-success bg-success/10' },
    { label: 'Unavailable Items', value: stats?.unavailableItems ?? 0, icon: XCircle, color: 'text-error bg-error/10' },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard Overview" />

      <div className="p-6 lg:p-8">
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardBody className="flex items-center gap-4">
                    <div className={`rounded-xl p-3 ${color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">{label}</p>
                      <p className="text-2xl font-bold text-text-primary">{value}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardBody>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </h2>
                {activity.length === 0 ? (
                  <p className="mt-4 text-sm text-text-secondary">
                    No recent activity. Changes you make will appear here.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {activity.map((log) => (
                      <li
                        key={log.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {log.action} — {log.entity_type}
                          </p>
                          {log.details && (
                            <p className="text-xs text-text-secondary">{log.details}</p>
                          )}
                        </div>
                        <span className="text-xs text-text-secondary">
                          {formatRelativeTime(log.created_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
