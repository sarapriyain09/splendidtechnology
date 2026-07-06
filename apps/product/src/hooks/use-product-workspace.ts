"use client";

import { useMemo } from "react";

export function useProductWorkspace(moduleName: string) {
  return useMemo(() => {
    return {
      moduleName,
      updatedAt: new Date().toISOString(),
      status: "active" as const,
    };
  }, [moduleName]);
}
