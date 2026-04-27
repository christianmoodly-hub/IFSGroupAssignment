export type AssignmentCode = "BAY" | "IFS";

export interface TeamMember {
  name: string;
  role: string;
  assignments: AssignmentCode[];
  tasks: Partial<Record<AssignmentCode, string>>;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Group Leader",
    role: "Group Leader & Compiler",
    assignments: ["BAY", "IFS"],
    tasks: {
      BAY:
        "Introduction, Executive Summary, Conclusion, Final Compilation",
      IFS:
        "Introduction, Executive Summary, Conclusion, Final Compilation",
    },
  },
  {
    name: "Kabu",
    role: "The Researcher",
    assignments: ["BAY", "IFS"],
    tasks: {
      BAY: "Q1 (Strategies & Value Proposition), Q3 (Competitor Strategies)",
      IFS: "Q1 (Project Objectives & Assumptions)",
    },
  },
  {
    name: "Tumelo",
    role: "Diagram Specialist",
    assignments: ["BAY", "IFS"],
    tasks: {
      BAY: "Q2a (UML Current), Q4a (UML Enhanced)",
      IFS: "Q3 (Network Diagram)",
    },
  },
  {
    name: "Keagan",
    role: "Process Modeler",
    assignments: ["BAY", "IFS"],
    tasks: {
      BAY: "Q2b (Swimlanes Current), Q4b (Swimlanes Enhanced)",
      IFS: "Q2 (Work Breakdown Structure)",
    },
  },
  {
    name: "Bandile",
    role: "The Analyst",
    assignments: ["BAY", "IFS"],
    tasks: {
      BAY: "Q4 (Process Discussion), Q5 (Performance Monitoring)",
      IFS: "Q5 (Risk Identification)",
    },
  },
  {
    name: "Lindile",
    role: "BAY Polish & References",
    assignments: ["BAY"],
    tasks: {
      BAY: "Reference list, Proofreading, Appendices",
    },
  },
  {
    name: "Thando",
    role: "Calculations & Risk Matrix",
    assignments: ["IFS"],
    tasks: {
      IFS:
        "Q4 (CPM Calculations — ES/EF/LS/LF/TS), Q6 (Risk Assessment Matrix)",
    },
  },
];

export function badgeLabel(assignments: AssignmentCode[]): "Both" | "BAY" | "IFS" {
  if (assignments.length === 2) return "Both";
  return assignments[0] ?? "BAY";
}
