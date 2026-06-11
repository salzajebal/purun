import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useGetTelegramSettings, 
  useUpdateTelegramSettings,
  useDiscoverTelegramChats,
  useTestTelegramNotification,
  getGetTelegramSettingsQueryKey,
  useGetAdminSettings,
  useUpdateAdminSettings,
  getGetAdminSettingsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BellRing, Send, Search, MessageCircle } from "lucide-react";

const telegramFormSchema = z.object({
  enabled: z.boolean().default(false),
  bot_token: z.string().optional(),
  chat_id: z.string().optional(),
  chat_name: z.string().optional(),
});

const kakaoFormSchema = z.object({
  kakao_link: z.string().optional(),
});

export function AdminSettings() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chats, setChats] = useState<{id: string, name: string, type: string}[]>([]);
  
  const headers = { "x-admin-token": token || "" };

  const { data: telegramSettings, isLoading: telegramLoading } = useGetTelegramSettings({
    query: {
      enabled: !!token,
      queryKey: getGetTelegramSettingsQueryKey(),
    },
    request: { headers }
  });

  const { data: siteSettings, isLoading: siteLoading } = useGetAdminSettings({
    query: {
      enabled: !!token,
      queryKey: getGetAdminSettingsQueryKey(),
    },
    request: { headers }
  });

  const telegramForm = useForm<z.infer<typeof telegramFormSchema>>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues: {
      enabled: false,
      bot_token: "",
      chat_id: "",
      chat_name: "",
    },
  });

  const kakaoForm = useForm<z.infer<typeof kakaoFormSchema>>({
    resolver: zodResolver(kakaoFormSchema),
    defaultValues: { kakao_link: "" },
  });

  useEffect(() => {
    if (telegramSettings) {
      telegramForm.reset({
        enabled: telegramSettings.enabled,
        bot_token: telegramSettings.bot_token || "",
        chat_id: telegramSettings.chat_id || "",
        chat_name: telegramSettings.chat_name || "",
      });
      if (telegramSettings.chat_id && telegramSettings.chat_name) {
        setChats([{ id: telegramSettings.chat_id, name: telegramSettings.chat_name, type: "saved" }]);
      }
    }
  }, [telegramSettings, telegramForm]);

  useEffect(() => {
    if (siteSettings) {
      kakaoForm.reset({ kakao_link: siteSettings.kakao_link || "" });
    }
  }, [siteSettings, kakaoForm]);

  const updateTelegramMutation = useUpdateTelegramSettings({
    request: { headers },
    mutation: {
      onSuccess: () => {
        toast({ title: "설정 저장됨", description: "텔레그램 알림 설정이 저장되었습니다." });
        queryClient.invalidateQueries({ queryKey: getGetTelegramSettingsQueryKey() });
      },
      onError: () => {
        toast({ variant: "destructive", title: "저장 실패", description: "설정 저장에 실패했습니다." });
      }
    }
  });

  const updateSiteSettingsMutation = useUpdateAdminSettings({
    request: { headers },
    mutation: {
      onSuccess: () => {
        toast({ title: "저장됨", description: "카카오톡 링크가 저장되었습니다." });
        queryClient.invalidateQueries({ queryKey: getGetAdminSettingsQueryKey() });
      },
      onError: () => {
        toast({ variant: "destructive", title: "저장 실패", description: "링크 저장에 실패했습니다." });
      }
    }
  });

  const discoverMutation = useDiscoverTelegramChats({
    request: { headers },
    mutation: {
      onSuccess: (data) => {
        if (data.chats && data.chats.length > 0) {
          setChats(data.chats);
          toast({ title: "채팅방 찾기 성공", description: `${data.chats.length}개의 채팅방을 찾았습니다.` });
        } else {
          toast({ variant: "destructive", title: "채팅방을 찾을 수 없음", description: "봇에 먼저 메시지를 보내주세요." });
        }
      },
      onError: () => {
        toast({ variant: "destructive", title: "채팅방 찾기 실패", description: "봇 토큰을 확인해주세요." });
      }
    }
  });

  const testMutation = useTestTelegramNotification({
    request: { headers },
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          toast({ title: "테스트 발송 성공", description: "텔레그램으로 테스트 메시지가 발송되었습니다." });
        } else {
          toast({ variant: "destructive", title: "테스트 발송 실패", description: data.message });
        }
      },
      onError: () => {
        toast({ variant: "destructive", title: "테스트 발송 오류", description: "알림을 보낼 수 없습니다. 설정을 확인해주세요." });
      }
    }
  });

  const onTelegramSubmit = (values: z.infer<typeof telegramFormSchema>) => {
    if (values.chat_id && chats.length > 0) {
      const selectedChat = chats.find(c => c.id === values.chat_id);
      if (selectedChat) values.chat_name = selectedChat.name;
    }
    updateTelegramMutation.mutate({ data: values });
  };

  const onKakaoSubmit = (values: z.infer<typeof kakaoFormSchema>) => {
    updateSiteSettingsMutation.mutate({ data: { kakao_link: values.kakao_link || "" } });
  };

  const onDiscover = () => {
    const bot_token = telegramForm.getValues("bot_token");
    if (!bot_token) {
      toast({ variant: "destructive", title: "토큰 필요", description: "봇 토큰을 먼저 입력해주세요." });
      return;
    }
    discoverMutation.mutate({ data: { bot_token } });
  };

  const onTest = () => {
    testMutation.mutate(undefined as unknown as void);
  };

  if (telegramLoading || siteLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">설정</h1>
        <p className="text-muted-foreground">시스템 설정을 관리합니다.</p>
      </div>

      {/* KakaoTalk Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-yellow-500" />
            카카오톡 오픈채팅 링크
          </CardTitle>
          <CardDescription>
            메인 화면의 카카오톡 상담 버튼에 연결될 오픈채팅 링크를 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...kakaoForm}>
            <form onSubmit={kakaoForm.handleSubmit(onKakaoSubmit)} className="space-y-4">
              <FormField
                control={kakaoForm.control}
                name="kakao_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>오픈채팅 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://open.kakao.com/o/xxxxxxx"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      카카오톡 오픈채팅방 링크를 붙여넣으세요. 비워두면 버튼을 눌러도 이동하지 않습니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2 border-t">
                <Button
                  type="submit"
                  disabled={updateSiteSettingsMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {updateSiteSettingsMutation.isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Telegram Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            텔레그램 알림 설정
          </CardTitle>
          <CardDescription>
            새로운 신청이 접수될 때마다 텔레그램으로 알림을 받을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...telegramForm}>
            <form onSubmit={telegramForm.handleSubmit(onTelegramSubmit)} className="space-y-6">
              <FormField
                control={telegramForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">알림 활성화</FormLabel>
                      <FormDescription>
                        신청 알림을 켤지 끌지 선택합니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {telegramForm.watch("enabled") && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormField
                    control={telegramForm.control}
                    name="bot_token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>봇 토큰 (Bot Token)</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" {...field} value={field.value || ''} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="secondary"
                            onClick={onDiscover}
                            disabled={discoverMutation.isPending}
                          >
                            {discoverMutation.isPending ? "검색 중..." : <><Search className="h-4 w-4 mr-2" />방 찾기</>}
                          </Button>
                        </div>
                        <FormDescription>
                          BotFather에게서 받은 HTTP API 토큰을 입력하세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={telegramForm.control}
                    name="chat_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>알림 받을 채팅방</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="방 찾기 버튼을 눌러 채팅방을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {chats.map(chat => (
                              <SelectItem key={chat.id} value={chat.id}>
                                {chat.name} ({chat.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          알림을 받을 채팅방을 선택하세요. 목록이 안 보이면 봇에게 메시지를 한 번 보내고 방 찾기를 다시 눌러주세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onTest}
                  disabled={!telegramForm.watch("enabled") || testMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  테스트 알림 보내기
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={updateTelegramMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {updateTelegramMutation.isPending ? "저장 중..." : "설정 저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
