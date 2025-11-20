"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity,
  Users,
  MousePointerClick,
  Calendar,
  Filter,
  TrendingUp,
  Eye,
  Zap,
  AlertCircle,
  Search,
  RefreshCw,
  BarChart3,
  PieChartIcon,
  Globe,
  Clock,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

interface EventData {
  user?: { name: string; email: string; id: string; hasOnboarded?: boolean };
  button?: string;
  [key: string]: any;
}

export interface TrackEventType {
  _id: string;
  userId?: string;
  eventName: string;
  page: string;
  data: EventData;
  timestamp: string | number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function TrackingDashboard() {
  const [events, setEvents] = useState<TrackEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchEvent, setSearchEvent] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchEvents = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/track/all");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const email = e.data?.user?.email?.toLowerCase() || "";
      const name = e.data?.user?.name?.toLowerCase() || "";
      const eventMatch = e.eventName.toLowerCase().includes(searchEvent.toLowerCase());
      const emailMatch = email.includes(searchEmail.toLowerCase()) || name.includes(searchEmail.toLowerCase());
      const dateMatch = selectedDate
        ? new Date(e.timestamp).toISOString().slice(0, 10) === selectedDate
        : true;

      return eventMatch && emailMatch && dateMatch;
    });
  }, [events, searchEvent, searchEmail, selectedDate]);

  // Analytics
  const totalEvents = events.length;
  const uniqueUsers = new Set(events.map((e) => e.data?.user?.email).filter(Boolean)).size;
  const todayEvents = events.filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const pageViews = Object.entries(
    events.reduce((acc, e) => {
      const path = e.page === "/" ? "/home" : e.page;
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([page, count]) => ({
      page: page.replace("/", "").charAt(0).toUpperCase() + page.slice(2) || "Home",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const eventTypes = Object.entries(
    events.reduce((acc, e) => {
      const name = e.eventName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topActions = events
    .reduce((acc, e) => {
      const button = e.data?.button || "Unknown Click";
      const key = `${e.eventName.replace(/_/g, " ")} → ${button}`;
      const existing = acc.find((i) => i.action === key);
      if (existing) existing.count++;
      else acc.push({ action: key, count: 1 });
      return acc;
    }, [] as { action: string; count: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Real-time insights into user behavior and product engagement
          </p>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Events", value: totalEvents.toLocaleString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Unique Users", value: uniqueUsers, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Today's Activity", value: todayEvents, icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { label: "Active Pages", value: pageViews.length, icon: Globe, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-0 shadow-xl ${stat.bg} backdrop-blur`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-full ${stat.bg}`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <CardTitle>Filters & Search</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={fetchEvents} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search event name..."
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Page Views Chart */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Most Visited Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Distribution Pie */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Event Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Actions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5" />
              Top User Actions (Heatmap)
            </CardTitle>
            <CardDescription>Most clicked buttons and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topActions.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.action}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {item.count} times
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events Table */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Events Stream
            </CardTitle>
            <CardDescription>
              Showing {filteredEvents.length} of {events.length} total events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.slice(0, 50).map((e) => (
                    <TableRow key={e._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">
                        {e.data?.user?.name?.split("@")[0] || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.data?.user?.email || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{e.eventName.replace(/_/g, " ")}</Badge>
                      </TableCell>
                      <TableCell>{e.page || "/"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {e.data?.button || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(new Date(e.timestamp), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}