"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportTableProps {
  rows: Array<Record<string, string | number>>;
  title: string;
}

function downloadFile(path: string) {
  window.open(path, "_blank", "noopener,noreferrer");
}

export function ReportTable({ rows, title }: ReportTableProps) {
  const headers = rows.length ? Object.keys(rows[0]) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => downloadFile("/api/analytics/export?format=xlsx")}>Export Excel</Button>
          <Button type="button" variant="outline" onClick={() => downloadFile("/api/analytics/export?format=pdf")}>Export PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        {!rows.length ? <p className="text-sm text-slate-500">No rows yet.</p> : null}
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  {headers.map((header) => (
                    <th key={header} className="px-3 py-2 font-medium text-slate-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    {headers.map((header) => (
                      <td key={header} className="px-3 py-2 text-slate-700">{String(row[header] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
