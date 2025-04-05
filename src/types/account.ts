
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  planStatus: "Free trial" | "Basic" | "Pro" | "Enterprise";
  trialDays?: number;
}

export interface TeamMemberInvite {
  id: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  invitedAt: Date;
}

export interface AccountSettings {
  notifications: {
    tasks: boolean;
    projects: boolean;
    comments: boolean;
    system: boolean;
  }
}
