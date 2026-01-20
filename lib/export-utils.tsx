import type { Sale } from "@/lib/types"
import { useAuth } from "./auth-context";

// Company info for reports
export const companyInfo = {
  name: "FuelPro Management System",
  address: "123 Fuel Station Road, Petroleum City, PC 12345",
  phone: "+91 98765 43210",
  email: "support@fuelpro.com",
  website: "www.fuelpro.com",
  logo: "⛽",
}
 

const IST_TIMEZONE = "Asia/Kolkata"

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    timeZone: IST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function generateReportId(): string {
  const now = new Date()
  return `RPT-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${now
    .toTimeString()
    .slice(0, 8)
    .replace(/:/g, "")}`
}

// ---------- Summary ----------
export function calculateSalesSummary(sales: Sale[]) {
  return {
    totalRevenue: sales.reduce((s, i) => s + i.amount, 0),
    totalQuantity: sales.reduce((s, i) => s + i.quantity, 0),
    totalTransactions: sales.length,
  }
}

// ---------- PDF EXPORT ----------
export function exportToPDF(sales: Sale[]): void {
  const reportId = generateReportId()
  const generatedAt = formatDateTime(new Date())
  const summary = calculateSalesSummary(sales)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Sales Report</title>
  <style>
    body { font-family: Arial; font-size: 11px; padding: 20px }
    h2 { color: #f97316 }
    table { width: 100%; border-collapse: collapse; margin-top: 10px }
    th, td { border: 1px solid #ddd; padding: 6px }
    th { background: #f97316; color: white }
    tr:nth-child(even) { background: #fafafa }
    .summary { display: flex; gap: 20px; margin: 15px 0 }
    .card { border: 1px solid #ddd; padding: 10px; flex: 1 }
  </style>
</head>
<body>

<h2>${companyInfo.logo} ${companyInfo.name}</h2>
<p>
${companyInfo.address}<br/>
Phone: ${companyInfo.phone} | ${companyInfo.email}
</p>

<p>
<b>Report ID:</b> ${reportId}<br/>
<b>Generated:</b> ${generatedAt}
</p>

<div class="summary">
  <div class="card"><b>Total Revenue</b><br/>${formatCurrency(summary.totalRevenue)}</div>
  <div class="card"><b>Total Quantity</b><br/>${summary.totalQuantity.toFixed(2)} L</div>
  <div class="card"><b>Total Transactions</b><br/>${summary.totalTransactions}</div>
</div>

<h3>Transaction Details</h3>

<table>
<thead>
<tr>
  <th>Date & Time</th>
  <th>Nozzle ID</th>
  <th>Fuel Type</th>
  <th>Opening</th>
  <th>Closing</th>
  <th>Quantity</th>
  <th>Rate</th>
  <th>Amount</th>
  <th>Payment</th>
</tr>
</thead>
<tbody>
${sales
  .map(
    (s) => `
<tr>
  <td>${formatDateTime(s.date)}</td>
  <td>${s.nozzleId}</td>
  <td>${s.fuelType}</td>
  <td>${s.openingReading}</td>
  <td>${s.closingReading}</td>
  <td>${s.quantity.toFixed(2)}</td>
  <td>${formatCurrency(s.rate)}</td>
  <td>${formatCurrency(s.amount)}</td>
  <td>${s.paymentMode}</td>
</tr>
`,
  )
  .join("")}
</tbody>
</table>

<p style="margin-top:20px;font-size:10px">
Computer generated report – No signature required
</p>

</body>
</html>
`

  const win = window.open("", "_blank")
  if (win) {
    win.document.write(html)
    win.document.close()
    win.print()
  }
}

// ---------- EXCEL (CSV) EXPORT ----------
export function exportToExcel(sales: Sale[]): void {
  const reportId = generateReportId()
  const rows: string[] = []

  rows.push(`"${companyInfo.name}"`)
  rows.push(`"SALES REPORT","${reportId}"`)
  rows.push("")

  rows.push(
    `"Date","Time","Nozzle ID","Fuel Type","Opening","Closing","Quantity","Rate","Amount","Payment Mode"`,
  )

  sales.forEach((s) => {
    rows.push(
      `"${formatDate(s.date)}","${formatTime(s.date)}","${s.nozzleId}","${s.fuelType}",
       "${s.openingReading}","${s.closingReading}",
       "${s.quantity}","${s.rate}","${s.amount}","${s.paymentMode}"`,
    )
  })

  const blob = new Blob(["\ufeff" + rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Sales_Report_${reportId}.csv`
  link.click()
}
