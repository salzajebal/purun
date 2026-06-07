import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/home";
import { AdminLogin } from "@/pages/admin/login";
import { AdminDashboard } from "@/pages/admin/dashboard";
import { AdminApplications } from "@/pages/admin/applications";
import { AdminSettings } from "@/pages/admin/settings";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

const queryClient = new QueryClient();

// A wrapper to protect admin routes
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard">
        {() => <ProtectedAdminRoute component={AdminDashboard} />}
      </Route>
      <Route path="/admin/applications">
        {() => <ProtectedAdminRoute component={AdminApplications} />}
      </Route>
      <Route path="/admin/settings">
        {() => <ProtectedAdminRoute component={AdminSettings} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
