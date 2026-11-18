import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  User,
  Lock,
  ShieldCheck,
  Key,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Users,
  Settings,
  Mail,
  Calendar,
  Award,
  Plus,
  UserPlus,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/coach/Modal";
import {
  useUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSystemUsersQuery,
  useUpdateUserRoleMutation,
  useCreateStaffUserMutation,
  type UserProfile,
} from "@/lib/api/user.queries";
import { useMembersQuery } from "@/lib/api/member.queries";
import { shortDate } from "@/lib/data/coach";
import type { UserRole, Member } from "@/lib/types";

export default function DashboardSettingsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  const { data: userProfile, isLoading: profileLoading } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const { data: systemUsers = [], isLoading: usersLoading } = useSystemUsersQuery();
  const updateUserRoleMutation = useUpdateUserRoleMutation();
  const createStaffUserMutation = useCreateStaffUserMutation();
  const { data: members = [] } = useMembersQuery();

  // Profile Form state
  const [fullName, setFullName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Add Staff Modal state
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"staff" | "admin">("staff");
  const [newStaffLinkedMemberId, setNewStaffLinkedMemberId] = useState("");
  const [athleteSearchQuery, setAthleteSearchQuery] = useState("");
  const [athleteDropdownOpen, setAthleteDropdownOpen] = useState(false);
  const [addStaffError, setAddStaffError] = useState("");

  const selectedAthlete = useMemo(() => {
    return members.find((m) => m.id === newStaffLinkedMemberId) || null;
  }, [members, newStaffLinkedMemberId]);

  const filteredMembers = useMemo(() => {
    if (!athleteSearchQuery.trim()) return members;
    const q = athleteSearchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name?.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.matricule && m.matricule.toLowerCase().includes(q)) ||
        (m.belt_rank && m.belt_rank.toLowerCase().includes(q))
    );
  }, [members, athleteSearchQuery]);

  const handleSelectAthlete = (member: Member | null) => {
    if (!member) {
      setNewStaffLinkedMemberId("");
      return;
    }
    setNewStaffLinkedMemberId(member.id);
    if (member.full_name) {
      setNewStaffName(member.full_name);
    }
    if (member.email) {
      setNewStaffEmail(member.email);
    }
    setAthleteSearchQuery("");
    setAthleteDropdownOpen(false);
  };

  const handleOpenAddStaff = () => {
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPassword("");
    setNewStaffRole("staff");
    setNewStaffLinkedMemberId("");
    setAthleteSearchQuery("");
    setAthleteDropdownOpen(false);
    setAddStaffError("");
    setAddStaffOpen(true);
  };

  useEffect(() => {
    if (userProfile?.full_name) {
      setFullName(userProfile.full_name);
    }
  }, [userProfile?.full_name]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    try {
      await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      setProfileSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ newPassword });
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password");
      toast.error(err?.message || "Failed to update password");
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRoleMutation.mutateAsync({ userId, role: newRole });
      toast.success(`Role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.message || "Could not update user role");
    }
  };

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStaffError("");

    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword) {
      setAddStaffError("Please fill in all required fields.");
      return;
    }

    if (newStaffPassword.length < 8) {
      setAddStaffError("Password must be at least 8 characters.");
      return;
    }

    try {
      await createStaffUserMutation.mutateAsync({
        fullName: newStaffName.trim(),
        email: newStaffEmail.trim(),
        password: newStaffPassword,
        role: newStaffRole,
        linkedMemberId: newStaffLinkedMemberId || null,
      });

      toast.success(`Staff user created successfully! (${newStaffRole})`);
      setAddStaffOpen(false);
      setNewStaffName("");
      setNewStaffEmail("");
      setNewStaffPassword("");
      setNewStaffRole("staff");
      setNewStaffLinkedMemberId("");
    } catch (err: any) {
      setAddStaffError(err?.message || "Failed to create staff user account");
    }
  };

  const isAdmin = userProfile?.role === "admin";
  const isStaffOrAdmin = userProfile?.role === "admin" || userProfile?.role === "staff";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Navigation */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          Account & Administration
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Settings & Profile
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your staff credentials, profile details, and system user privileges.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink/10">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: "profile" })}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            currentTab === "profile"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: "security" })}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            currentTab === "security"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Security & Password</span>
        </button>

        {isStaffOrAdmin && (
          <button
            type="button"
            onClick={() => setSearchParams({ tab: "team" })}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentTab === "team"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff Roster & Roles</span>
            {systemUsers.length > 0 && (
              <span className="rounded-full bg-secondary px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                {systemUsers.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Tab 1: Profile Details */}
      {currentTab === "profile" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-ink/12 bg-card p-6 shadow-xs">
              <h2 className="font-display text-base font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Update how your name appears on training sessions and club records.
              </p>

              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={userProfile?.email || ""}
                      disabled
                      className="pl-9 bg-muted/50 cursor-not-allowed opacity-80"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Managed by Supabase Auth and cannot be edited directly.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Roland Roland"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending || !fullName.trim()}
                    className="gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : profileSaved ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{profileSaved ? "Saved" : "Save Changes"}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* User badge card */}
          <div>
            <div className="rounded-xl border border-ink/12 bg-card p-6 shadow-xs">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Account Status
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-ink/8 pb-2.5">
                  <span className="text-xs text-muted-foreground">System Role</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] lowercase ${
                      userProfile?.role === "admin"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : userProfile?.role === "staff"
                        ? "bg-primary/10 text-primary font-semibold"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {userProfile?.role || "member"}
                  </span>
                </div>

                {userProfile?.created_at && (
                  <div className="flex items-center justify-between border-b border-ink/8 pb-2.5">
                    <span className="text-xs text-muted-foreground">Member Since</span>
                    <span className="font-mono text-xs text-foreground">
                      {shortDate(userProfile.created_at)}
                    </span>
                  </div>
                )}

                {userProfile?.linkedMember && (
                  <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      <span>Linked Club Judoka</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Rank: <span className="font-medium text-foreground">{userProfile.linkedMember.belt_rank}</span>
                    </p>
                    {userProfile.linkedMember.matricule && (
                      <p className="text-muted-foreground">
                        Matricule: <span className="font-mono">{userProfile.linkedMember.matricule}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {currentTab === "security" && (
        <div className="max-w-xl space-y-6">
          <div className="rounded-xl border border-ink/12 bg-card p-6 shadow-xs">
            <h2 className="font-display text-base font-semibold text-foreground">
              Update Password
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Ensure your account uses a secure password with at least 8 characters.
            </p>

            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              {passwordError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Your password has been updated successfully.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs">
                  New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-9"
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-9"
                    minLength={8}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending || !newPassword}
                  className="gap-2"
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Staff & System Users */}
      {currentTab === "team" && isStaffOrAdmin && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Registered Staff & Users
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isAdmin
                  ? "Manage club administrators, staff dashboard access, and system roles."
                  : "View the roster of registered staff members and administrators (read-only)."}
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={handleOpenAddStaff}
                className="gap-2 shrink-0 self-start sm:self-auto"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Staff Member</span>
              </Button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-ink/12 bg-card shadow-xs">
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : systemUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No user profiles found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-ink/10 bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Judoka / Staff Name</th>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Assigned Role</th>
                      <th className="px-5 py-3.5">Registered</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/8">
                    {systemUsers.map((user) => {
                      const userRole: UserRole =
                        user.role === "admin"
                          ? "admin"
                          : user.role === "staff"
                          ? "staff"
                          : "member";
                      const isCurrentUser = user.id === userProfile?.id;

                      return (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span>{user.full_name || "Unnamed User"}</span>
                              {isCurrentUser && (
                                <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] text-primary">
                                  You
                                </span>
                              )}
                              {user.linkedMember && (
                                <span className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                                  {user.linkedMember.belt_rank} Belt
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-muted-foreground">
                            {user.email || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] lowercase ${
                                userRole === "admin"
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                  : userRole === "staff"
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              <ShieldCheck className="h-3 w-3" />
                              {userRole}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-muted-foreground">
                            {user.created_at ? shortDate(user.created_at) : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {isAdmin && !isCurrentUser ? (
                              <div className="inline-flex items-center gap-1.5">
                                {userRole !== "admin" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[11px]"
                                    onClick={() => handleRoleChange(user.id, "admin")}
                                    disabled={updateUserRoleMutation.isPending}
                                  >
                                    Make Admin
                                  </Button>
                                )}
                                {userRole !== "staff" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[11px]"
                                    onClick={() => handleRoleChange(user.id, "staff")}
                                    disabled={updateUserRoleMutation.isPending}
                                  >
                                    Make Staff
                                  </Button>
                                )}
                                {userRole !== "member" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-[11px] text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRoleChange(user.id, "member")}
                                    disabled={updateUserRoleMutation.isPending}
                                  >
                                    Demote
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] font-mono text-muted-foreground/60">
                                {isCurrentUser ? "Self" : "Read-only"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Staff Modal for Administrators */}
      {isAdmin && (
        <Modal
          open={addStaffOpen}
          title="Add Staff Member"
          description="Create a dashboard management account for a coach, manager, or club administrator."
          onClose={() => setAddStaffOpen(false)}
        >
          <form onSubmit={handleAddStaffSubmit} className="space-y-4">
            {addStaffError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addStaffError}</span>
              </div>
            )}

            {/* 1. LINK TO CLUB ATHLETE (SEARCHABLE & AT THE TOP) */}
            <div className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span>Link to Club Athlete (Optional)</span>
                </Label>
                {selectedAthlete && (
                  <button
                    type="button"
                    onClick={() => handleSelectAthlete(null)}
                    className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear Link</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Select an existing judoka from the roster to prefill their details and connect their profile.
              </p>

              {selectedAthlete ? (
                <div className="mt-2 flex items-center justify-between rounded-md border border-primary/30 bg-card p-2.5">
                  <div className="min-w-0">
                    <p className="font-medium text-xs text-foreground truncate">
                      {selectedAthlete.full_name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-primary font-semibold">
                        {selectedAthlete.belt_rank} Belt
                      </span>
                      {selectedAthlete.matricule && (
                        <span className="font-mono">#{selectedAthlete.matricule}</span>
                      )}
                      {selectedAthlete.email && <span>{selectedAthlete.email}</span>}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] shrink-0"
                    onClick={() => {
                      setNewStaffLinkedMemberId("");
                      setAthleteDropdownOpen(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="relative mt-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={athleteSearchQuery}
                      onChange={(e) => {
                        setAthleteSearchQuery(e.target.value);
                        setAthleteDropdownOpen(true);
                      }}
                      onFocus={() => setAthleteDropdownOpen(true)}
                      placeholder="Search roster by athlete name, belt, matricule..."
                      className="pl-8 text-xs bg-background h-9"
                    />
                    {athleteSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setAthleteSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {athleteDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAthleteDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-ink/15 bg-card shadow-lg divide-y divide-ink/8">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectAthlete(null);
                            setAthleteDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                          None (Independent Staff Member - no athlete linked)
                        </button>

                        {filteredMembers.length === 0 ? (
                          <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                            No athletes match "{athleteSearchQuery}"
                          </div>
                        ) : (
                          filteredMembers.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => handleSelectAthlete(member)}
                              className="w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-muted/50 transition-colors"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-medium text-foreground truncate">
                                  {member.full_name}
                                </p>
                                {member.email && (
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {member.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                                  {member.belt_rank}
                                </span>
                                {member.matricule && (
                                  <span className="font-mono text-[9px] text-muted-foreground/75">
                                    #{member.matricule}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 2. FULL NAME */}
            <div className="space-y-1">
              <Label htmlFor="staffName" className="text-xs">
                Full Name *
              </Label>
              <Input
                id="staffName"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="e.g. Roland Roland"
                required
              />
            </div>

            {/* 3. EMAIL ADDRESS */}
            <div className="space-y-1">
              <Label htmlFor="staffEmail" className="text-xs">
                Email Address *
              </Label>
              <Input
                id="staffEmail"
                type="email"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                placeholder="staff@ubajudo.club"
                required
              />
            </div>

            {/* 4. TEMPORARY PASSWORD */}
            <div className="space-y-1">
              <Label htmlFor="staffPassword" className="text-xs">
                Initial Temporary Password *
              </Label>
              <Input
                id="staffPassword"
                type="password"
                value={newStaffPassword}
                onChange={(e) => setNewStaffPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <p className="text-[10px] text-muted-foreground">
                The user can change this password after signing in.
              </p>
            </div>

            {/* 5. ROLE SELECTOR */}
            <div className="space-y-1">
              <Label className="text-xs">Assigned Role *</Label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition-colors ${
                    newStaffRole === "staff"
                      ? "border-primary bg-primary/10 font-medium text-foreground"
                      : "border-ink/15 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">staff</p>
                    <p className="text-[10px] text-muted-foreground">
                      Manage sessions & athletes
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="staffRole"
                    value="staff"
                    checked={newStaffRole === "staff"}
                    onChange={() => setNewStaffRole("staff")}
                    className="sr-only"
                  />
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition-colors ${
                    newStaffRole === "admin"
                      ? "border-amber-500 bg-amber-500/10 font-medium text-foreground"
                      : "border-ink/15 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">admin</p>
                    <p className="text-[10px] text-muted-foreground">
                      Full access + staff invites
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="staffRole"
                    value="admin"
                    checked={newStaffRole === "admin"}
                    onChange={() => setNewStaffRole("admin")}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddStaffOpen(false)}
                disabled={createStaffUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createStaffUserMutation.isPending}
                className="gap-1.5"
              >
                {createStaffUserMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                <span>Create Staff Account</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
