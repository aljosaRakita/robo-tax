import type { CategoryInfo } from "@/lib/types";

export const categories: CategoryInfo[] = [
  {
    id: "financial",
    label: "Financial",
    icon: "landmark",
    description: "Banks, brokerages, and investment accounts",
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: "calculator",
    description: "Accounting and bookkeeping software",
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: "bitcoin",
    description: "Cryptocurrency exchanges and wallets",
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: "home",
    description: "Property data and valuations",
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: "users",
    description: "Payroll and HR systems",
  },
  {
    id: "r-and-d",
    label: "R&D",
    icon: "flask-conical",
    description: "Engineering tools for R&D tax credit evidence",
  },
  {
    id: "other",
    label: "Other",
    icon: "puzzle",
    description: "Email, documents, payments, and more",
  },
];
