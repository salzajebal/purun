import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Briefcase, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboard() {
  const { token } = useAuth();
  
  const { data: stats, isLoading, error } = useGetAdminStats({
    query: {
      enabled: !!token,
      queryKey: getGetAdminStatsQueryKey(),
    },
    request: {
      headers: { "x-admin-token": token || "" }
    }
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          데이터를 불러오는데 실패했습니다. 권한을 확인해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">대시보드</h1>
        <p className="text-muted-foreground">전체 대출 신청 현황을 요약하여 보여줍니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">총 신청 건수</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total || 0}건</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">금일 신청 건수</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-primary">{stats?.today || 0}건</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              직업군별 신청 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.by_job_type && stats.by_job_type.length > 0 ? (
                  stats.by_job_type.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-medium">{stat.job_type}</span>
                      <span className="text-muted-foreground">{stat.count}건</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">데이터가 없습니다.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              최근 신청 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recent && stats.recent.length > 0 ? (
                  stats.recent.map((app) => (
                    <div key={app.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{app.name} <span className="text-xs text-muted-foreground ml-2">{app.job_type}</span></p>
                        <p className="text-sm text-muted-foreground">{app.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{app.loan_amount || '미상'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">최근 신청 내역이 없습니다.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
