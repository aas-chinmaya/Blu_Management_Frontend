



"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Loader2, Users, User, Calendar, X } from "lucide-react";
import { toast } from "sonner";

import { fetchTeamByProjectId } from "@/modules/project-management/team/slices/teamSlice";
import { assignBug, fetchBugByProjectId } from "@/modules/project-management/issues/slices/bugSlice";

// Hook to get projectId directly from URL
const useProjectIdFromUrl = () => {
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/"); 
      // Example: /project/AAS-IT-2-006?tab=issues
      if (pathParts.length >= 3) {
        setProjectId(pathParts[2]);
      }
    }
  }, []);
// console.log(projectId);

  return projectId;
};

const BugAssignModal = ({ isOpen, onOpenChange, bug, bugId, onAssign }) => {
  const dispatch = useDispatch();
  const projectId = useProjectIdFromUrl(); // get projectId from URL

  const { teamsByProject: teams, status: teamStatus } = useSelector(
    (state) => state.team
  );

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teams when modal opens
  useEffect(() => {
    if (projectId && isOpen) {
      dispatch(fetchTeamByProjectId(projectId));
    }
  }, [dispatch, projectId, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTeamId("");
      setSelectedTeam(null);
      setSelectedMember("");
      setDeadline("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Auto-select team/member if bug is already assigned
  useEffect(() => {
    if (!isOpen || !bug || teams.length === 0) return;

    const assignedMemberId = bug?.assignedTo;
    if (!assignedMemberId) return;

    const foundTeam = teams.find((team) =>
      team.teamMembers?.some(
        (m) => String(m.memberId) === String(assignedMemberId)
      )
    );

    if (foundTeam) {
      setSelectedTeamId(String(foundTeam.teamId));
      setSelectedTeam(foundTeam);
      setSelectedMember(String(assignedMemberId));
    }
  }, [isOpen, bug, teams]);

  // Handle selecting a team
  const handleTeamSelect = (teamId) => {
    setSelectedTeamId(teamId);
    const found = teams.find((t) => String(t.teamId) === String(teamId));
    setSelectedTeam(found || null);
    setSelectedMember("");
  };

  // Assign bug
  const handleAssign = async () => {
    if (!selectedTeamId) return toast.error("Please select a team");
    if (!selectedMember) return toast.error("Please select a member");
    if (!deadline) return toast.error("Please select a deadline");

    const payload = {
      assignedTo: selectedMember,
      deadline,
      teamId: selectedTeamId,
    };

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        assignBug({ bug_id: bugId, payload })
      ).unwrap();

      toast.success(result?.message || "Bug assigned successfully");
  await dispatch(fetchBugByProjectId(projectId));

      if (onAssign) onAssign(result);

      onOpenChange(false);
    } catch (error) {
      toast.error(error?.message || "Failed to assign bug");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-white shadow-lg border p-6 rounded-lg">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-lg font-semibold">
            <span>
              Assign Bug:{" "}
              {bug?.title
                ? bug.title.slice(0, 30) + (bug.title.length > 30 ? "..." : "")
                : "N/A"}
            </span>

       
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-5 mt-4">

          {/* TEAM */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex gap-1 items-center">
              <Users className="h-4 w-4 text-blue-500" /> Team
            </label>

            <Select
              value={selectedTeamId || ""}
              onValueChange={handleTeamSelect}
            >
              <SelectTrigger className="h-10 border rounded-lg">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>

              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.teamId} value={String(team.teamId)}>
                    {team.teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TEAM MEMBERS */}
          {selectedTeam && (
            <div>
              <label className="text-sm font-medium text-gray-700 flex gap-1 items-center">
                <User className="h-4 w-4 text-blue-500" /> Team Member
              </label>

              <Select
                value={selectedMember || ""}
                onValueChange={setSelectedMember}
              >
                <SelectTrigger className="h-10 border rounded-lg">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>

                <SelectContent>
                  {selectedTeam.teamMembers.map((member) => (
                    <SelectItem
                      key={member.memberId}
                      value={String(member.memberId)}
                    >
                      {member.memberName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* DEADLINE */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex gap-1 items-center">
              <Calendar className="h-4 w-4 text-blue-500" /> Deadline
            </label>

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 border rounded-lg px-3"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">

          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleAssign}
            disabled={isSubmitting}
            className="bg-blue-600 text-white flex-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Assigning...
              </>
            ) : (
              "Assign Bug"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BugAssignModal;
