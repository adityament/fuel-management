import type { Sale } from "@/lib/types"

// Company info for reports
export const companyInfo = {
  name: "FuelPro Management System",
  address: "123 Fuel Station Road, Petroleum City, PC 12345",
  phone: "+91 98765 43210",
  email: "support@fuelpro.com",
  website: "www.fuelpro.com",
  logo: "⛽", // Using emoji as placeholder - can be replaced with actual logo URL
}

// Helper to format date
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Helper to format time
export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// Helper to format datetime
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

// Helper to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

// Generate unique report ID
export function generateReportId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "")
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "")
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `RPT-${dateStr}-${timeStr}-${random}`
}

// Calculate sales summary
export function calculateSalesSummary(sales: Sale[]) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0)
  const totalTransactions = sales.length

  // Group by fuel type
  const fuelBreakdown = sales.reduce(
    (acc, sale) => {
      if (!acc[sale.fuelType]) {
        acc[sale.fuelType] = { quantity: 0, amount: 0, count: 0 }
      }
      acc[sale.fuelType].quantity += sale.quantity
      acc[sale.fuelType].amount += sale.amount
      acc[sale.fuelType].count += 1
      return acc
    },
    {} as Record<string, { quantity: number; amount: number; count: number }>,
  )

  // Group by payment mode
  const paymentBreakdown = sales.reduce(
    (acc, sale) => {
      if (!acc[sale.paymentMode]) {
        acc[sale.paymentMode] = { amount: 0, count: 0 }
      }
      acc[sale.paymentMode].amount += sale.amount
      acc[sale.paymentMode].count += 1
      return acc
    },
    {} as Record<string, { amount: number; count: number }>,
  )

  return {
    totalRevenue,
    totalQuantity,
    totalTransactions,
    fuelBreakdown,
    paymentBreakdown,
  }
}

// Export to PDF (opens print dialog with formatted content)
export function exportToPDF(sales: Sale[]): void {
  const reportId = generateReportId()
  const generatedAt = formatDateTime(new Date())
  const summary = calculateSalesSummary(sales)

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Report - ${reportId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 20px; 
          color: #1a1a1a;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #f97316;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo {
          font-size: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #f97316;
        }
        .company-details {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
        }
        .report-info {
          text-align: right;
          font-size: 11px;
          color: #666;
        }
        .report-title {
          font-size: 18px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        .summary-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .summary-card {
          background: linear-gradient(135deg, #fff7ed, #ffedd5);
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .summary-card h3 {
          font-size: 12px;
          color: #9a3412;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #c2410c;
        }
        .breakdown-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        .breakdown-card {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 15px;
        }
        .breakdown-card h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f97316;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          font-size: 12px;
        }
        .breakdown-item:last-child { border-bottom: none; }
        .breakdown-label { color: #666; }
        .breakdown-value { font-weight: 600; color: #1a1a1a; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 11px;
        }
        th {
          background: #f97316;
          color: white;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }
        tr:nth-child(even) { background: #fafafa; }
        tr:hover { background: #fff7ed; }
        .fuel-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
        .fuel-petrol { background: #dbeafe; color: #1d4ed8; }
        .fuel-diesel { background: #dcfce7; color: #16a34a; }
        .fuel-premium { background: #fae8ff; color: #a855f7; }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #f97316;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
        }
        .page-break { page-break-before: always; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          <div class="logo">${companyInfo.logo}</div>
          <div>
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-details">
              ${companyInfo.address}<br>
              Phone: ${companyInfo.phone} | Email: ${companyInfo.email}
            </div>
          </div>
        </div>
        <div class="report-info">
          <div class="report-title">SALES REPORT</div>
          <div>Report ID: <strong>${reportId}</strong></div>
          <div>Generated: ${generatedAt}</div>
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total Revenue</h3>
          <div class="value">${formatCurrency(summary.totalRevenue)}</div>
        </div>
        <div class="summary-card">
          <h3>Total Quantity</h3>
          <div class="value">${summary.totalQuantity.toFixed(2)} L</div>
        </div>
        <div class="summary-card">
          <h3>Total Transactions</h3>
          <div class="value">${summary.totalTransactions}</div>
        </div>
      </div>

      <div class="breakdown-section">
        <div class="breakdown-card">
          <h4>Fuel Type Breakdown</h4>
          ${Object.entries(summary.fuelBreakdown)
            .map(
              ([type, data]) => `
            <div class="breakdown-item">
              <span class="breakdown-label">${type}</span>
              <span class="breakdown-value">${data.quantity.toFixed(2)} L | ${formatCurrency(data.amount)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="breakdown-card">
          <h4>Payment Mode Breakdown</h4>
          ${Object.entries(summary.paymentBreakdown)
            .map(
              ([mode, data]) => `
            <div class="breakdown-item">
              <span class="breakdown-label">${mode}</span>
              <span class="breakdown-value">${data.count} txns | ${formatCurrency(data.amount)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <h4 style="font-size: 14px; margin-bottom: 10px; color: #1a1a1a;">Transaction Details</h4>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Invoice</th>
            <th>Fuel Type</th>
            <th>Quantity</th>
            <th>Rate/L</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Staff</th>
          </tr>
        </thead>
        <tbody>
          ${sales
            .map(
              (sale) => `
            <tr>
              <td>${formatDateTime(sale.date)}</td>
              <td>${sale.invoiceNo}</td>
              <td>
                <span class="fuel-badge fuel-${sale.fuelType.toLowerCase().replace(" ", "-")}">
                  ${sale.fuelType}
                </span>
              </td>
              <td>${sale.quantity.toFixed(2)} L</td>
              <td>${formatCurrency(sale.rate)}</td>
              <td><strong>${formatCurrency(sale.amount)}</strong></td>
              <td>${sale.paymentMode}</td>
              <td>${sale.staffName}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <div>
          ${companyInfo.name} | ${companyInfo.website}
        </div>
        <div>
          This is a computer-generated report. No signature required.
        </div>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

// Export to Excel (CSV format)
export function exportToExcel(sales: Sale[]): void {
  const reportId = generateReportId()
  const generatedAt = formatDateTime(new Date())
  const summary = calculateSalesSummary(sales)

  // Build CSV content with headers and summary
  const csvRows: string[] = []

  // Company header
  csvRows.push(`"${companyInfo.name}"`)
  csvRows.push(`"${companyInfo.address}"`)
  csvRows.push(`"Phone: ${companyInfo.phone} | Email: ${companyInfo.email}"`)
  csvRows.push("")
  csvRows.push(`"SALES REPORT"`)
  csvRows.push(`"Report ID","${reportId}"`)
  csvRows.push(`"Generated On","${generatedAt}"`)
  csvRows.push("")

  // Summary section
  csvRows.push(`"SUMMARY"`)
  csvRows.push(`"Total Revenue","${formatCurrency(summary.totalRevenue)}"`)
  csvRows.push(`"Total Quantity","${summary.totalQuantity.toFixed(2)} L"`)
  csvRows.push(`"Total Transactions","${summary.totalTransactions}"`)
  csvRows.push("")

  // Fuel breakdown
  csvRows.push(`"FUEL TYPE BREAKDOWN"`)
  csvRows.push(`"Fuel Type","Quantity (L)","Amount","Transactions"`)
  Object.entries(summary.fuelBreakdown).forEach(([type, data]) => {
    csvRows.push(`"${type}","${data.quantity.toFixed(2)}","${formatCurrency(data.amount)}","${data.count}"`)
  })
  csvRows.push("")

  // Payment breakdown
  csvRows.push(`"PAYMENT MODE BREAKDOWN"`)
  csvRows.push(`"Payment Mode","Amount","Transactions"`)
  Object.entries(summary.paymentBreakdown).forEach(([mode, data]) => {
    csvRows.push(`"${mode}","${formatCurrency(data.amount)}","${data.count}"`)
  })
  csvRows.push("")

  // Transaction details
  csvRows.push(`"TRANSACTION DETAILS"`)
  csvRows.push(`"Date","Time","Invoice No","Fuel Type","Quantity (L)","Rate/L","Amount","Payment Mode","Staff Name"`)

  sales.forEach((sale) => {
    const date = formatDate(sale.date)
    const time = formatTime(sale.date)
    csvRows.push(
      `"${date}","${time}","${sale.invoiceNo}","${sale.fuelType}","${sale.quantity.toFixed(2)}","${sale.rate.toFixed(2)}","${sale.amount.toFixed(2)}","${sale.paymentMode}","${sale.staffName}"`,
    )
  })

  // Create and download file
  const csvContent = csvRows.join("\n")
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `Sales_Report_${reportId}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
