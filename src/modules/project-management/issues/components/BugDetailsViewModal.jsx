



// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { formatDateTimeIST } from "@/utils/formatDate";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useDispatch, useSelector } from "react-redux";
// import { resolveBug, clearErrors, getBugById } from "@/modules/project-management/issues/slices/bugSlice";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Loader2, Bug, Calendar, User, Clock, AlertCircle, FileText, CheckCircle, Clock as ClockIcon, ExternalLinkIcon } from "lucide-react";
// import { toast } from "sonner";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const BugDetailsViewModal = ({ isOpen, onOpenChange,employeeId, bugId }) => {
//   const { currentUser } = useCurrentUser();
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { bugDetails } = useSelector((state) => state.bugs);
//   const loading = useSelector((state) => state.bugs.loading?.bugResolve);
//   const error = useSelector((state) => state.bugs.error?.bugResolve);
//   const [delayReason, setDelayReason] = useState(bugDetails?.delayReason || "");
//   const [resolutionNote, setResolutionNote] = useState("");

//   useEffect(() => {
//     if (bugId) {
//       dispatch(getBugById(bugId));
//     }
//   }, [dispatch, bugId]);

//   useEffect(() => {
//     if (isOpen && bugDetails) {
//       setDelayReason(bugDetails?.delayReason || "");
//       setResolutionNote("");
//     }

//     return () => {
//       if (error) {
//         dispatch(clearErrors());
//       }
//     };
//   }, [dispatch, isOpen, bugDetails, error]);

//   // const handleResolveBug = () => {
//   //   if (!bugDetails) return;

//   //   if (!resolutionNote.trim()) {
//   //     toast.error("Please provide a resolution note.");
//   //     return;
//   //   }

//   //   const bugDeadlineDate = new Date(bugDetails.deadline);
//   //   const now = new Date();
//   //   const isPastDeadline = now > bugDeadlineDate;

//   //   if (isPastDeadline && !delayReason.trim()) {
//   //     toast.error("Please provide a reason for the delay.");
//   //     return;
//   //   }
    
//   //   const payload = {
//   //     bugId: bugDetails.bug_id,
//   //     resolutionNote,
//   //     ...(isPastDeadline && { delayReason }),
//   //   };

//   //   dispatch(resolveBug(payload)).then((result) => {
//   //     if (result.error) {
//   //       toast.error(`Failed to resolve bug: ${result.error.message}`);
//   //     } else {
//   //       toast.success("Issue resolved successfully!");
//   //        dispatch(fetchBugByEmployeeId(employeeId));
//   //       onOpenChange(false);
//   //     }
//   //   });
//   // };
// const handleResolveBug = async () => {
//   if (!bugDetails) return;

//   if (!resolutionNote.trim()) {
//     toast.error("Please provide a resolution note.");
//     return;
//   }

//   const bugDeadlineDate = new Date(bugDetails.deadline);
//   const now = new Date();
//   const isPastDeadline = now > bugDeadlineDate;

//   if (isPastDeadline && !delayReason.trim()) {
//     toast.error("Please provide a reason for the delay.");
//     return;
//   }

//   const payload = {
//     bugId: bugDetails.bug_id,
//     resolutionNote,
//     ...(isPastDeadline && { delayReason }),
//   };

//   try {
//     const result = await dispatch(resolveBug(payload)).unwrap();

//     // ---- API SUCCESS ----
//     toast.success(result?.message || "Issue resolved successfully!");

//     // refresh employee bugs list
//     dispatch(fetchBugByEmployeeId(employeeId));

//     // close modal
//     onOpenChange(false);

//   } catch (err) {
//     // ---- API FAILED ----
//     toast.error(err?.message || "Failed to resolve bug.");
//   }
// };

//   if (!bugDetails) {
//     return null;
//   }

//   const isAssignedToCurrentUser = currentUser?.id === bugDetails?.assignedTo;
//   const isResolved = (bugDetails?.status || "").toLowerCase() === "resolved";

//   const bugDeadlineDate = bugDetails.deadline ? new Date(bugDetails.deadline) : null;
//   const now = new Date();
//   const isOverdue = bugDeadlineDate && now > bugDeadlineDate;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="w-full max-w-full max-h-[100vh] sm:max-w-4xl sm:max-h-[90vh] md:max-w-5xl bg-white shadow-lg border-gray-200 rounded-lg text-black overflow-y-auto">
//         <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 sticky top-0 bg-white z-10">
//           <DialogTitle className="text-gray-800 text-lg font-bold flex items-center gap-2">
//             <Bug className="h-5 w-5" />
//             Issue Details
//           </DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 px-4 sm:px-6">

//           {/* Bug ID */}
//           <div className="flex flex-col">
//             <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//               <FileText className="h-3 w-3" />
//               Issue ID
//             </Label>
//             <p className="text-xs text-black p-2 bg-gray-50 rounded border">{bugDetails.bug_id}</p>
//           </div>

//           {/* Status - Colored Chip */}
//           <div className="flex flex-col">
//             <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//               <CheckCircle className="h-3 w-3" />
//               Status
//             </Label>
//             <div className="p-2">
//               <span className={`
//                 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
//                 ${bugDetails.status?.toLowerCase() === 'resolved' ? 'bg-green-100 text-green-800' :
//                   bugDetails.status?.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800' :
//                   bugDetails.status?.toLowerCase() === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                   bugDetails.status?.toLowerCase() === 'closed' ? 'bg-gray-100 text-gray-800' :
//                   'bg-gray-100 text-gray-700'}
//               `}>
//                 {bugDetails.status || "N/A"}
//               </span>
//             </div>
//           </div>

//           {/* Priority - Colored Chip */}
//           <div className="flex flex-col">
//             <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//               <AlertCircle className="h-3 w-3" />
//               Priority
//             </Label>
//             <div className="p-2">
//               <span className={`
//                 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
//                 ${bugDetails.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
//                   bugDetails.priority?.toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-800' :
//                   bugDetails.priority?.toLowerCase() === 'low' ? 'bg-gray-100 text-gray-700' :
//                   'bg-gray-100 text-gray-700'}
//               `}>
//                 {bugDetails.priority || "N/A"}
//               </span>
//             </div>
//           </div>

//           {/* Deadline + Strong Overdue Badge */}
//           {bugDetails.deadline && (
//             <div className="flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <Calendar className="h-3 w-3" />
//                 Deadline
//               </Label>
//               <div className="flex items-center gap-3">
//                 <p className="text-xs text-black p-2">
//                   {formatDateTimeIST(bugDetails.deadline) || "N/A"}
//                 </p>
//                 {isOverdue && bugDetails?.status?.toLowerCase() !== "resolved" && (
//                   <span className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1 animate-pulse">
//                     <AlertCircle className="h-3.5 w-3.5" />
//                     OVERDUE
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Assigned To */}
//           {bugDetails?.assignedToDetails?.memberName && (
//             <div className="flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <User className="h-3 w-3" />
//                 Assigned To
//               </Label>
//               <p className="text-xs text-black p-2">{bugDetails.assignedToDetails.memberName}</p>
//             </div>
//           )}

//           {/* Project Id */}
//           {bugDetails.projectId && (
//             <div className="flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <FileText className="h-3 w-3" />
//                 Project Id
//               </Label>
//               <p className="text-xs text-black p-2">{bugDetails.projectId}</p>
//             </div>
//           )}

//           {/* Created At */}
//           {bugDetails.createdAt && (
//             <div className="flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <ClockIcon className="h-3 w-3" />
//                 Created At
//               </Label>
//               <p className="text-xs text-black p-2">{formatDateTimeIST(bugDetails.createdAt)}</p>
//             </div>
//           )}

//           {/* Task Reference */}
//           {bugDetails?.taskRef && (
//             <div className="flex flex-col relative">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <FileText className="h-3 w-3" />
//                 Reference
//               </Label>
//               <div className="inline-flex items-center gap-2">
//                 <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-medium">
//                   {bugDetails.taskRef}
//                 </span>
//                 <span className="relative group cursor-pointer text-blue-600">
//                   <ExternalLinkIcon className="w-4 h-4" />
//                   <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                     Click to view full task
//                   </span>
//                   <span
//                     onClick={() => router.push(`/task/${bugDetails.taskRef}`)}
//                     className="absolute inset-0 cursor-pointer"
//                   />
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Attachment */}
//           {bugDetails.attachmentLinks && (
//             <div className="mt-2">
//               <Label className="text-xs font-bold text-gray-800 mb-1">Attachment</Label>
//               <a
//                 href={bugDetails.attachmentLinks}
//                 download
//                 className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-800 font-medium transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
//                 </svg>
//                 <span>Download</span>
//               </a>
//             </div>
//           )}

//           {/* Title */}
//           <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
//             <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//               <FileText className="h-3 w-3" />
//               Title
//             </Label>
//             <p className="text-sm font-semibold text-black p-3 bg-gray-50 rounded border">{bugDetails.title}</p>
//           </div>

//           {/* Description */}
//           {bugDetails.description && (
//             <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <FileText className="h-3 w-3" />
//                 Description
//               </Label>
//               <p className="text-sm text-black p-4 rounded-md border border-gray-200 bg-gray-50 whitespace-pre-wrap break-words">
//                 {bugDetails.description}
//               </p>
//             </div>
//           )}

//           {/* Delay Reason */}
//           {(isOverdue && !isResolved && isAssignedToCurrentUser) || bugDetails.delayReason ? (
//             <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <Clock className="h-3 w-3" />
//                 Delay Reason
//               </Label>
//               {isResolved || bugDetails.delayReason ? (
//                 <p className="text-sm text-black p-3 rounded-md border border-gray-200 bg-gray-50">
//                   {bugDetails.delayReason || "N/A"}
//                 </p>
//               ) : (
//                 <Textarea
//                   className="text-sm text-black p-3 rounded-md border border-gray-200 min-h-[4rem] max-h-40 resize-y focus:border-gray-500 focus:ring focus:ring-gray-200"
//                   value={delayReason}
//                   onChange={(e) => setDelayReason(e.target.value)}
//                   placeholder="Enter reason for delay (required if overdue)"
//                 />
//               )}
//             </div>
//           ) : null}

//           {/* Resolution Note */}
//           {(!isResolved && isAssignedToCurrentUser) || bugDetails.resolutionNote ? (
//             <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
//               <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
//                 <CheckCircle className="h-3 w-3" />
//                 Resolution Note
//               </Label>
//               {!isResolved && isAssignedToCurrentUser ? (
//                 <Textarea
//                   className="text-sm text-black p-3 rounded-md border border-gray-200 min-h-[6rem] max-h-40 resize-y focus:border-gray-500 focus:ring focus:ring-gray-200"
//                   value={resolutionNote}
//                   onChange={(e) => setResolutionNote(e.target.value)}
//                   placeholder="Describe how the issue was resolved"
//                 />
//               ) : (
//                 <p className="text-sm text-black p-3 rounded-md border border-gray-200 bg-gray-50">
//                   {bugDetails.resolutionNote || "N/A"}
//                 </p>
//               )}
//             </div>
//           ) : null}

//           {/* Error Message */}
//           {error && (
//             <div className="sm:col-span-2 lg:col-span-3 text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded p-3">
//               {error}
//             </div>
//           )}
//         </div>

//         <DialogFooter className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white sticky bottom-0">
//           {!isResolved && isAssignedToCurrentUser && (
//             <Button
//               onClick={handleResolveBug}
//               className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   Resolving...
//                 </>
//               ) : (
//                 "Resolve Issue"
//               )}
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BugDetailsViewModal;











"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDateTimeIST } from "@/utils/formatDate";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { resolveBug, clearErrors, getBugById, fetchBugByEmployeeId } from "@/modules/project-management/issues/slices/bugSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Bug, Calendar, User, Clock, AlertCircle, FileText, CheckCircle, Clock as ClockIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BugDetailsViewModal = ({ isOpen, onOpenChange, employeeId, bugId }) => {
  const { currentUser } = useCurrentUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const { bugDetails } = useSelector((state) => state.bugs);
  const loading = useSelector((state) => state.bugs.loading?.bugResolve);
  const error = useSelector((state) => state.bugs.error?.bugResolve);

  const [delayReason, setDelayReason] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Fetch bug details on open
  useEffect(() => {
    if (bugId) dispatch(getBugById(bugId));
  }, [dispatch, bugId]);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen && bugDetails) {
      setDelayReason(bugDetails?.delayReason || "");
      setResolutionNote("");
    }
    return () => dispatch(clearErrors());
  }, [isOpen, bugDetails, dispatch]);

  if (!bugDetails) return null;

  const isAssignedToCurrentUser = currentUser?.id === bugDetails?.assignedTo;
  const isResolved = (bugDetails?.status || "").toLowerCase() === "resolved";

  const deadlineDate = bugDetails.deadline ? new Date(bugDetails.deadline) : null;
  const isOverdue = deadlineDate && new Date() > deadlineDate;

  // -------------------------------------------------------
  // 🚫 Disable Resolve Button if required fields missing
  // -------------------------------------------------------
  const isResolveDisabled =
    !resolutionNote.trim() || (isOverdue && !delayReason.trim()) || loading;

  // -------------------------------------------------------
  // Resolve Handler
  // -------------------------------------------------------
  const handleResolveBug = async () => {
    if (!bugDetails) return;

    const payload = {
      bugId: bugDetails.bug_id,
      resolutionNote,
      ...(isOverdue && { delayReason }),
    };

    try {
      const result = await dispatch(resolveBug(payload)).unwrap();

      toast.success(result?.message || "Issue resolved successfully!");

      dispatch(fetchBugByEmployeeId(employeeId));

      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to resolve bug.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full max-h-[100vh] sm:max-w-4xl sm:max-h-[90vh] md:max-w-5xl bg-white shadow-lg border-gray-200 rounded-lg text-black overflow-y-auto">

        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 sticky top-0  z-10">
          <DialogTitle className="text-gray-800 text-lg font-bold flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Issue Details
          </DialogTitle>
        </DialogHeader>

        {/* =================== DETAILS GRID ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 px-4 sm:px-6">

          {/* ID */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold flex items-center gap-1">
              <FileText className="h-3 w-3" /> Issue ID
            </Label>
            <p className="text-xs p-2 bg-gray-50 border rounded">{bugDetails.bug_id}</p>
          </div>

          {/* STATUS */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Status
            </Label>
            <span className="px-3 py-1 mt-2 inline-block rounded-full text-xs font-bold bg-gray-100">
              {bugDetails.status}
            </span>
          </div>

          {/* PRIORITY */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Priority
            </Label>
            <span className="px-3 py-1 mt-2 inline-block rounded-full text-xs font-bold bg-gray-100">
              {bugDetails.priority}
            </span>
          </div>

          {/* DEADLINE */}
          {bugDetails.deadline && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Deadline
              </Label>
              <p className="text-xs p-2">{formatDateTimeIST(bugDetails.deadline)}</p>

              {isOverdue && !isResolved && (
                <span className="px-3 py-1 mt-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse">
                  OVERDUE
                </span>
              )}
            </div>
          )}

          {/* Assigned To */}
          {bugDetails?.assignedToDetails?.memberName && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold flex items-center gap-1">
                <User className="h-3 w-3" /> Assigned To
              </Label>
              <p className="text-xs p-2">{bugDetails.assignedToDetails.memberName}</p>
            </div>
          )}

          {/* TITLE */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Label className="text-xs font-bold flex items-center gap-1">
              <FileText className="h-3 w-3" /> Title
            </Label>
            <p className="p-3 mt-1 bg-gray-50 border rounded">{bugDetails.title}</p>
          </div>

          {/* DESCRIPTION */}
          {bugDetails.description && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs font-bold flex items-center gap-1">
                <FileText className="h-3 w-3" /> Description
              </Label>
              <p className="p-4 bg-gray-50 border rounded whitespace-pre-wrap">
                {bugDetails.description}
              </p>
            </div>
          )}

          {/* Delay Reason */}
          {(isOverdue && !isResolved && isAssignedToCurrentUser) || bugDetails.delayReason ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" /> Delay Reason
              </Label>

              {isResolved || bugDetails.delayReason ? (
                <p className="p-3 bg-gray-50 border rounded">{bugDetails.delayReason}</p>
              ) : (
                <Textarea
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="p-3 border rounded"
                  placeholder="Enter delay reason"
                />
              )}
            </div>
          ) : null}

          {/* Resolution Note */}
          {(!isResolved && isAssignedToCurrentUser) || bugDetails.resolutionNote ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs font-bold flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Resolution Note
              </Label>

              {!isResolved && isAssignedToCurrentUser ? (
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="p-3 border rounded"
                  placeholder="Describe resolution"
                />
              ) : (
                <p className="p-3 bg-gray-50 border rounded">{bugDetails.resolutionNote}</p>
              )}
            </div>
          ) : null}
        </div>

        {/* =================== FOOTER ====================== */}
        <DialogFooter className="px-4 sm:px-6 py-4 border-t bg-white sticky bottom-0">
          {!isResolved && isAssignedToCurrentUser && (
            <Button
              onClick={handleResolveBug}
              disabled={isResolveDisabled}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Resolving...
                </>
              ) : (
                "Resolve Issue"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BugDetailsViewModal;
