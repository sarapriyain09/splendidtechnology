import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { requireSession } from "@/common/auth";
import { ReportService } from "@/apps/analytics/services";

const reportService = new ReportService();

async function exportXlsx() {
  const rows = await reportService.runTablePreview();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Analytics Report");

  worksheet.columns = [
    { header: "Opportunity", key: "name", width: 28 },
    { header: "Company", key: "company", width: 24 },
    { header: "Stage", key: "stage", width: 20 },
    { header: "Amount", key: "amount", width: 12 },
    { header: "Updated At", key: "updatedAt", width: 26 },
  ];

  for (const row of rows) {
    worksheet.addRow(row);
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=analytics-report.xlsx",
    },
  });
}

async function exportPdf() {
  const rows = await reportService.runTablePreview();
  const doc = new PDFDocument({ margin: 36 });
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

  doc.fontSize(16).text("Analytics Report", { underline: true });
  doc.moveDown();
  doc.fontSize(10);

  for (const row of rows) {
    doc.text(`${row.name} | ${row.company} | ${row.stage} | GBP ${row.amount}`);
  }

  doc.end();

  const buffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))));
    });
  });

  const bytes = new Uint8Array(buffer);

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=analytics-report.pdf",
    },
  });
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireSession();
  if (!session) return response;

  const format = request.nextUrl.searchParams.get("format") || "xlsx";
  if (format === "pdf") return exportPdf();
  return exportXlsx();
}
