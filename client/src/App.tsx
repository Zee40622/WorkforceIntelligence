import { Route, Switch } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import EmployeeDetails from "@/pages/EmployeeDetails";
import Payroll from "@/pages/Payroll";
import Attendance from "@/pages/Attendance";
import Performance from "@/pages/Performance";
import Recruitment from "@/pages/Recruitment";
import Settings from "@/pages/Settings";
import SelfService from "@/pages/SelfService";
import Compliance from "@/pages/Compliance";
import Inbox from "@/pages/Inbox";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/employees" component={Employees} />
      <Route path="/employees/:id" component={EmployeeDetails} />
      <Route path="/payroll" component={Payroll} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/performance" component={Performance} />
      <Route path="/recruitment" component={Recruitment} />
      <Route path="/self-service" component={SelfService} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
