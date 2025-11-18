


"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTaskList,
  selectAllTaskList,
  selectTaskStatus,
} from "@/modules/project-management/task/slices/taskSlice";
import {
  Search,
  Filter,
  AlertCircle,
  ArrowUpDown,
  RotateCcw,
  Bug as BugIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { FiX } from "react-icons/fi";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

const statusColors = {
  Pending: "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  Completed: "bg-blue-100 text-blue-700 border-blue-200",
};

const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const statusFilterOptions = [
  { value: "all", label: "All Tasks" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const priorityFilterOptions = [
  { value: "all", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const sortOptions = [
  { value: "task_id-asc", label: "Task ID (Low to High)" },
  { value: "task_id-desc", label: "Task ID (High to Low)" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "status-asc", label: "Status (A-Z)" },
  { value: "status-desc", label: "Status (Z-A)" },
  { value: "priority-asc", label: "Priority (Low to High)" },
  { value: "priority-desc", label: "Priority (High to Low)" },
  { value: "deadline-desc", label: "Deadline (Newest First)" },
  { value: "deadline-asc", label: "Deadline (Oldest First)" },
];

export default function AllTask() {
  const router = useRouter();
  const dispatch = useDispatch();
  // const tasks = useSelector(selectAllTaskList) || [];
  const rawTasks = useSelector(selectAllTaskList);

const tasks = useMemo(() => rawTasks ?? [], [rawTasks]);

  const status = useSelector(selectTaskStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("task_id-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [tempItemsPerPage, setTempItemsPerPage] = useState("10");

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllTaskList());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedPriority, sortBy, itemsPerPage]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === "Pending").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length,
    high: tasks.filter(t => t.priority === "High").length,
    medium: tasks.filter(t => t.priority === "Medium").length,
    low: tasks.filter(t => t.priority === "Low").length,
  }), [tasks]);

  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.title?.toLowerCase().includes(term) ||
        t.projectName?.toLowerCase().includes(term) ||
        t.task_id?.toString().includes(term)
      );
    }
    if (selectedStatus !== "all") result = result.filter(t => t.status === selectedStatus);
    if (selectedPriority !== "all") result = result.filter(t => t.priority === selectedPriority);

    const priorityOrder = { Low: 1, Medium: 2, High: 3 };

    result.sort((a, b) => {
      switch (sortBy) {
        case "task_id-asc": return (a.task_id || 0) - (b.task_id || 0);
        case "task_id-desc": return (b.task_id || 0) - (a.task_id || 0);
        case "title-asc": return (a.title || "").localeCompare(b.title || "");
        case "title-desc": return (b.title || "").localeCompare(a.title || "");
        case "status-asc": return (a.status || "").localeCompare(b.status || "");
        case "status-desc": return (b.status || "").localeCompare(a.status || "");
        case "priority-asc": return (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        case "priority-desc": return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case "deadline-desc": return new Date(b.deadline || 0) - new Date(a.deadline || 0);
        case "deadline-asc": return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        default: return 0;
      }
    });

    return result;
  }, [tasks, searchTerm, selectedStatus, selectedPriority, sortBy]);

  const totalItems = processedTasks.length;
  const totalPages = Math.ceil(totalItems / Number(itemsPerPage));
  const paginatedTasks = processedTasks.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage)
  );

  const hasActiveFilters = searchTerm || selectedStatus !== "all" || selectedPriority !== "all" || sortBy !== "task_id-desc";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSortBy("task_id-desc");
  };

  const handleRowClick = (task) => {
    router.push(`/workspace/task/${task.task_id}`);
  };

  const SkeletonRow = () => (
    <TableRow className="border-b border-gray-100">
      <TableCell className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></TableCell>
      <TableCell className="py-4 px-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div></TableCell>
      <TableCell className="py-4 px-4"><div className="h-7 bg-gray-200 rounded-full w-20 animate-pulse"></div></TableCell>
      <TableCell className="py-4 px-4 hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></TableCell>
      <TableCell className="py-4 px-4 hidden sm:table-cell"><div className="h-7 bg-gray-200 rounded-full w-16 animate-pulse"></div></TableCell>
    </TableRow>
  );

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-gray-50">
        <Card className="overflow-hidden shadow-lg border-0 bg-white">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 sm:p-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
              All Tasks ({totalItems})
            </h2>
          </div>

          <CardContent className="p-1">
            {status === "loading" && tasks.length === 0 ? (
              <div className="p-8">
                <div className="h-16 bg-gray-200 rounded-lg animate-pulse mb-6" />
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        {[...Array(5)].map((_, i) => (
                          <TableHead key={i} className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <>
                {/* Filter Section with Floating Reset */}
                <div className="relative w-full flex flex-col sm:flex-wrap sm:flex-row gap-3 sm:gap-4 mb-4 p-4 bg-gray-100 rounded-lg shadow-sm items-stretch">
                  {[
                    {
                      label: "Search Tasks",
                      icon: <Search className="h-4 w-4 text-teal-600" />,
                      content: (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Title, project, or task ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10"
                          />
                          {searchTerm && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSearchTerm("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                            >
                              <FiX className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ),
                    },
                    {
                      label: "Status",
                      icon: <Filter className="h-4 w-4 text-teal-600" />,
                      content: (
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusFilterOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{opt.label}</span>
                                  {opt.value !== "all" && (
                                    <Badge variant="secondary" className="ml-3 text-xs">
                                      {opt.value === "Pending" ? taskStats.pending
                                        : opt.value === "In Progress" ? taskStats.inProgress
                                        : taskStats.completed}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ),
                    },
                    {
                      label: "Priority",
                      icon: <AlertCircle className="h-4 w-4 text-teal-600" />,
                      content: (
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityFilterOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{opt.label}</span>
                                  {opt.value !== "all" && (
                                    <Badge variant="secondary" className="ml-3 text-xs">
                                      {opt.value === "High" ? taskStats.high
                                        : opt.value === "Medium" ? taskStats.medium : taskStats.low}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ),
                    },
                    {
                      label: "Sort By",
                      icon: <ArrowUpDown className="h-4 w-4 text-teal-600" />,
                      content: (
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10">
                            <SelectValue placeholder="Task ID (High to Low)" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ),
                    },
                  ].map((field, i) => (
                    <div
                      key={i}
                      className="flex flex-col flex-1 min-w-[240px] sm:min-w-[200px] md:min-w-[250px] lg:min-w-[280px] bg-gray-50 rounded-lg p-2 justify-between"
                    >
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        {field.icon}
                        <span>{field.label}</span>
                      </div>
                      {field.content}
                    </div>
                  ))}

                  {/* Floating Reset Button */}
                  {hasActiveFilters && (
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={clearFilters}
                          className="absolute top-6 right-6 h-10 w-10 rounded-full border-gray-300 hover:bg-gray-200 shadow-md transition-all duration-200 z-10"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="bg-gray-700 text-white text-sm rounded-md px-2 py-1">
                          Reset all filters
                          <Tooltip.Arrow className="fill-gray-700" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  )}
                </div>

                {/* Table */}
                <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white">
                  <div className="min-h-[50dvh] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gradient-to-r from-teal-50 to-blue-50 border-b-2 border-teal-100 z-10">
                        <TableRow>
                          <TableHead className="font-semibold text-gray-700 py-4 px-4">Task Title</TableHead>
                          <TableHead className="font-semibold text-gray-700 hidden md:table-cell py-4 px-4">Project</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-4">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700 hidden lg:table-cell py-4 px-4">Deadline</TableHead>
                          <TableHead className="font-semibold text-gray-700 hidden sm:table-cell py-4 px-4">Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTasks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-20">
                              <BugIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-xl font-medium text-gray-600">No tasks found</p>
                              <p className="text-gray-500">Try adjusting your filters</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedTasks.map((task) => (
                            <Tooltip.Root key={task.task_id}>
                              <Tooltip.Trigger asChild>
                                <TableRow
                                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                                  onClick={() => handleRowClick(task)}
                                >
                                  <TableCell className="py-4 px-4 font-medium text-gray-900 group-hover:text-teal-600">
                                    {task.title}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell py-4 px-4 text-gray-600">
                                    {task.projectName || "N/A"}
                                  </TableCell>
                                  <TableCell className="py-4 px-4">
                                    <Badge className={cn("text-xs capitalize", statusColors[task.status] || "bg-gray-100")}>
                                      {task.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden lg:table-cell py-4 px-4 text-gray-600">
                                    {task.deadline ? format(new Date(task.deadline), "MMM dd, yyyy") : "No Deadline"}
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell py-4 px-4">
                                    <Badge className={cn("text-xs", priorityColors[task.priority] || "bg-gray-100")}>
                                      {task.priority}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content className="bg-gray-700 text-white text-sm rounded-md px-2 py-1">
                                  View task details
                                  <Tooltip.Arrow className="fill-gray-700" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-6 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Label>Show</Label>
                      <Select value={tempItemsPerPage} onValueChange={setTempItemsPerPage}
                        onOpenChange={(open) => !open && tempItemsPerPage !== itemsPerPage && setItemsPerPage(tempItemsPerPage)}>
                        <SelectTrigger className="w-16 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["5", "8", "10", "20"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span>per page</span>
                      <span className="text-gray-400">({totalItems} total)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Button>
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn("h-8 w-8", currentPage === i + 1 ? "bg-teal-600 hover:bg-teal-700 text-white" : "")}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Tooltip.Provider>
  );
}