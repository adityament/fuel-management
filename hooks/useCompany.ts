"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context"; // apna actual path daal dena
import { CompanyInfo, DEFAULT_COMPANY } from "@/lib/types"; // adjust path

export function useCompany() {
  const { token } = useAuth();
  const [company, setCompany] = useState<CompanyInfo>(DEFAULT_COMPANY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCompany({
            name: data.name || DEFAULT_COMPANY.name,
            address: data.address || DEFAULT_COMPANY.address,
            phone: data.phone || DEFAULT_COMPANY.phone,
            email: data.email || DEFAULT_COMPANY.email,
            website: data.website || DEFAULT_COMPANY.website,
            logo: data.logo || DEFAULT_COMPANY.logo,
          });
        }
      } catch (err) {
        console.warn("Company fetch failed, using default", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [token]);

  return { company, loading };
}