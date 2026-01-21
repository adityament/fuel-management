import type { Sale } from "@/lib/types"

// Assuming your user type looks something like this (adjust as per your actual user)
interface UserForReport {
  username?: string
  email?: string
  phone?: string
  location?: {
    latitude?: number
    longitude?: number
  }
  // ... other fields
}

const IST_TIMEZONE = "Asia/Kolkata"

// Formatting functions same as before...
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
  if (!date) return "—"
  return new Date(date).toLocaleString("en-IN", {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateReportId(): string {
  const now = new Date()
  return `RPT-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${now
    .toTimeString()
    .slice(0, 8)
    .replace(/:/g, "")}`
}

export function calculateSalesSummary(sales: Sale[]) {
  return {
    totalRevenue: sales.reduce((s, i) => s + i.amount, 0),
    totalQuantity: sales.reduce((s, i) => s + i.quantity, 0),
    totalTransactions: sales.length,
  }
}

// PDF – user se details le raha hai
export function exportToPDF(sales: Sale[], user?: UserForReport): void {
  const name = user?.username || "Fuel Pump Admin"
  const email = user?.email || "admin@fuelpump.local"
  const phone = user?.phone || "Not set"
  const locationStr = user?.location?.latitude && user?.location?.longitude
    ? `Lat: ${user.location.latitude.toFixed(6)}, Lng: ${user.location.longitude.toFixed(6)}`
    : "Location not set"

  const logo = "⛽" // ya user initials se bana sakte ho: user?.username?.charAt(0)?.toUpperCase() || "A"

  const reportId = generateReportId()
  const generatedAt = formatDateTime(new Date())
  const summary = calculateSalesSummary(sales)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Sales Report - ${reportId}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; color: #333; }
    h2 { color: #f97316; margin-bottom: 8px; }
    h3 { color: #444; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f97316; color: white; }
    tr:nth-child(even) { background: #fafafa; }
    .summary { display: flex; gap: 16px; margin: 20px 0; }
    .card { border: 1px solid #e5e7eb; padding: 12px; flex: 1; border-radius: 6px; background: #fff; }
    .meta { margin-bottom: 20px; font-size: 12px; }
  </style>
</head>
<body>

<h2>${logo} ${name}</h2>
<p style="margin: 4px 0;">${locationStr}<br/>Phone: ${phone} | ${email}</p>

<div class="meta">
  <b>Report ID:</b> ${reportId}<br/>
  <b>Generated:</b> ${generatedAt}
</div>

<div class="summary">
  <div class="card"><b>Total Revenue</b><br/>${formatCurrency(summary.totalRevenue)}</div>
  <div class="card"><b>Total Quantity</b><br/>${summary.totalQuantity.toFixed(2)} L</div>
  <div class="card"><b>Transactions</b><br/>${summary.totalTransactions}</div>
</div>

<h3>Transaction Details</h3>

<table>
<thead>
<tr>
  <th>Date & Time</th>
  <th>Nozzle</th>
  <th>Fuel</th>
  <th>Opening</th>
  <th>Closing</th>
  <th>Qty (L)</th>
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
</tr>`,
  )
  .join("")}
</tbody>
</table>

<p style="margin-top:30px; font-size:10px; color:#666; text-align:center;">
  Computer generated report – No signature required
</p>

</body>
</html>
  `

  const win = window.open("", "_blank")
  if (win) {
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 500)
  }
}

// CSV – user se details
export function exportToExcel(sales: Sale[], user?: UserForReport): void {
  const name = user?.username || "Fuel Pump Admin"
  const reportId = generateReportId()
  const rows: string[] = []

  rows.push(`"${name}"`)
  rows.push(`"SALES REPORT","${reportId}"`)
  rows.push(`"Generated","${formatDateTime(new Date())}"`)
  rows.push("")

  rows.push(
    `"Date & Time","Nozzle ID","Fuel Type","Opening Reading","Closing Reading","Quantity (L)","Rate","Amount","Payment Mode"`,
  )

  sales.forEach((s) => {
    rows.push(
      `"${formatDateTime(s.date)}","${s.nozzleId}","${s.fuelType}","${s.openingReading}","${s.closingReading}","${s.quantity.toFixed(2)}","${s.rate}","${s.amount}","${s.paymentMode}"`,
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