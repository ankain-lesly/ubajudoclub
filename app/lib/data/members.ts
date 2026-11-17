import type { Member, Rank } from "@/lib/types";

export const MOCK_MEMBERS: Member[] = [
  {
    id: "mem-1",
    full_name: "Tita Calton Asanga",
    matricule: "UBa23E0018",
    program: "Computer Science",
    belt_rank: "Black",
    status: "active",
    joined_on: "2023-10-02",
    sessions_total: 142,
    sessions_since_promotion: 38,
    last_attended: "2026-11-14",
  },
  {
    id: "mem-2",
    full_name: "Eric Mbuh",
    matricule: "UBa24E0142",
    program: "Software Engineering",
    belt_rank: "Green",
    status: "active",
    joined_on: "2024-10-15",
    sessions_total: 58,
    sessions_since_promotion: 14,
    last_attended: "2026-11-14",
  },
  {
    id: "mem-3",
    full_name: "Brenda Tche",
    matricule: "UBa22L0089",
    program: "Faculty of Law",
    belt_rank: "Brown",
    status: "active",
    joined_on: "2022-11-05",
    sessions_total: 110,
    sessions_since_promotion: 24,
    last_attended: "2026-11-14",
  },
  {
    id: "mem-4",
    full_name: "Fongoh Danielle",
    matricule: "UBa23N0033",
    program: "Nursing Sciences",
    belt_rank: "Blue",
    status: "active",
    joined_on: "2023-11-10",
    sessions_total: 82,
    sessions_since_promotion: 18,
    last_attended: "2026-11-11",
  },
  {
    id: "mem-5",
    full_name: "Colins Nfor",
    matricule: "UBa23P0055",
    program: "Physics & Material Science",
    belt_rank: "Blue",
    status: "active",
    joined_on: "2023-10-20",
    sessions_total: 79,
    sessions_since_promotion: 15,
    last_attended: "2026-11-14",
  },
  {
    id: "mem-6",
    full_name: "Grace Anoma",
    matricule: "UBa24M0201",
    program: "Medical Laboratory Sciences",
    belt_rank: "Orange",
    status: "active",
    joined_on: "2024-11-01",
    sessions_total: 36,
    sessions_since_promotion: 8,
    last_attended: "2026-11-11",
  },
  {
    id: "mem-7",
    full_name: "Kevin Nde",
    matricule: "UBa25E0312",
    program: "Civil Engineering",
    belt_rank: "Yellow",
    status: "active",
    joined_on: "2025-10-08",
    sessions_total: 22,
    sessions_since_promotion: 2,
    last_attended: "2026-11-11",
  },
  {
    id: "mem-8",
    full_name: "Miriam Bih",
    matricule: "UBa25A0074",
    program: "Economics & Management",
    belt_rank: "White",
    status: "active",
    joined_on: "2025-11-03",
    sessions_total: 12,
    sessions_since_promotion: 12,
    last_attended: "2026-11-09",
  },
  {
    id: "mem-9",
    full_name: "Batupe Joel",
    matricule: "UBa25C0119",
    program: "Biochemistry",
    belt_rank: "White",
    status: "active",
    joined_on: "2025-11-03",
    sessions_total: 9,
    sessions_since_promotion: 9,
    last_attended: "2026-11-09",
  },
  {
    id: "mem-10",
    full_name: "Ndumbe Walter",
    matricule: "UBa21G0015",
    program: "Geology (Alumni)",
    belt_rank: "Black",
    status: "active",
    joined_on: "2021-10-15",
    sessions_total: 165,
    sessions_since_promotion: 65,
    last_attended: "2026-11-07",
  },
  {
    id: "mem-11",
    full_name: "Suh Samuel",
    matricule: "UBa24E0255",
    program: "Mechanical Engineering",
    belt_rank: "Orange",
    status: "active",
    joined_on: "2024-10-22",
    sessions_total: 41,
    sessions_since_promotion: 13,
    last_attended: "2026-11-11",
  },
  {
    id: "mem-12",
    full_name: "Ngozi Chiamaka",
    matricule: "UBa25F0090",
    program: "Banking & Finance",
    belt_rank: "White",
    status: "active",
    joined_on: "2025-11-03",
    sessions_total: 8,
    sessions_since_promotion: 8,
    last_attended: "2026-11-09",
  },
];

export function getMockMembers(): Member[] {
  return [...MOCK_MEMBERS];
}

export function searchMockMembers(query = "", rankFilter?: Rank | "All"): Member[] {
  let list = MOCK_MEMBERS;
  if (rankFilter && rankFilter !== "All") {
    list = list.filter((m) => m.belt_rank === rankFilter);
  }
  if (!query.trim()) return list;

  const q = query.toLowerCase().trim();
  return list.filter(
    (m) =>
      m.full_name.toLowerCase().includes(q) ||
      (m.matricule && m.matricule.toLowerCase().includes(q)) ||
      (m.program && m.program.toLowerCase().includes(q)),
  );
}
