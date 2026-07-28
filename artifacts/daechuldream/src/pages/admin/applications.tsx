import { useState } from "react";
import { 
  useGetAdminApplications, 
  useDeleteApplication,
  getGetAdminApplicationsQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminApplications() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [jobType, setJobType] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryParams = { 
    page, 
    limit: 10, 
    ...(jobType !== "all" ? { job_type: jobType } : {})
  };

  const { data, isLoading, error } = useGetAdminApplications(queryParams, {
    query: {
      enabled: !!token,
      queryKey: getGetAdminApplicationsQueryKey(queryParams),
    },
    request: {
      headers: { "x-admin-token": token || "" }
    }
  });

  const deleteMutation = useDeleteApplication({
    request: {
      headers: { "x-admin-token": token || "" }
    },
    mutation: {
      onSuccess: () => {
        toast({
          title: "삭제 완료",
          description: "신청 내역이 성공적으로 삭제되었습니다.",
        });
        queryClient.invalidateQueries({ queryKey: getGetAdminApplicationsQueryKey(queryParams) });
        setDeleteId(null);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "삭제 실패",
          description: "신청 내역 삭제에 실패했습니다.",
        });
        setDeleteId(null);
      }
    }
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">신청 내역</h1>
          <p className="text-muted-foreground">모든 대출 신청 내역을 조회하고 관리합니다.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={jobType} onValueChange={(val) => { setJobType(val); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="직업군 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="직장인">직장인</SelectItem>
              <SelectItem value="사업자">사업자</SelectItem>
              <SelectItem value="주부">주부</SelectItem>
              <SelectItem value="무직자">무직자</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            조회 결과
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (총 {data?.total || 0}건)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>신청일시</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>직업군</TableHead>
                  <TableHead>희망금액</TableHead>
                  <TableHead>목적</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.applications && data.applications.length > 0 ? (
                  data.applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium text-sm text-muted-foreground">
                        {new Date(app.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                      </TableCell>
                      <TableCell className="font-semibold">{app.name}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                          {app.job_type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-primary">{app.loan_amount || '-'}</TableCell>
                      <TableCell>{app.loan_purpose || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(app.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      신청 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination (Simplified) */}
          {data && data.total > 10 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <div className="text-sm font-medium">
                {page} / {Math.ceil(data.total / 10)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 10)}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 신청 내역이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
