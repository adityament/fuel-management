"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Download } from "lucide-react"
import { exportToPDF, exportToExcel } from "@/lib/export-utils"
import type { Sale } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"   // ← yahan se user le rahe hain

interface DownloadButtonsProps {
  sales: Sale[]
  variant?: "separate" | "dropdown"
  size?: "sm" | "default" | "lg"
}

export function DownloadButtons({
  sales,
  variant = "separate",
  size = "sm",
}: DownloadButtonsProps) {
  const { user, loading: authLoading } = useAuth()

  const handleExportPDF = () => {
    if (authLoading || !user) return
    exportToPDF(sales, user)
  }

  const handleExportExcel = () => {
    if (authLoading || !user) return
    exportToExcel(sales, user)
  }

  const isDisabled = authLoading || !user

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className="bg-transparent"
            disabled={isDisabled}
          >
            <Download className="mr-2 h-4 w-4" />
            {authLoading ? "Loading..." : "Download Report"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportPDF} disabled={isDisabled}>
            <FileText className="mr-2 h-4 w-4 text-red-500" />
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportExcel} disabled={isDisabled}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
            Download as Excel (CSV)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={handleExportPDF}
        className="bg-transparent"
        disabled={isDisabled}
      >
        <FileText className="mr-2 h-4 w-4 text-red-500" />
        PDF
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={handleExportExcel}
        className="bg-transparent"
        disabled={isDisabled}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
        Excel
      </Button>
    </div>
  )
}