"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Download } from "lucide-react"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import type { Sale } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DownloadButtonsProps {
  sales: Sale[]
  variant?: "separate" | "dropdown"
  size?: "sm" | "default" | "lg"
}

export function DownloadButtons({ sales, variant = "separate", size = "sm" }: DownloadButtonsProps) {
  const handleExportPDF = () => {
    exportToPDF(sales)
  }

  const handleExportExcel = () => {
    exportToExcel(sales)
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4 text-red-500" />
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
            Download as Excel (CSV)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size={size} onClick={handleExportPDF} className="bg-transparent">
        <FileText className="mr-2 h-4 w-4 text-red-500" />
        PDF
      </Button>
      <Button variant="outline" size={size} onClick={handleExportExcel} className="bg-transparent">
        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
        Excel
      </Button>
    </div>
  )
}
