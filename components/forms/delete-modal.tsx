"use client"

import { Modal } from "@/components/ui/modal" // same Modal you're using for SaleModal
import { Button } from "@/components/ui/button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  loading?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Sale",
  description = "Are you sure you want to delete this sale? This action cannot be undone.",
  loading = false,
  
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg m-4">
      <div className="space-y-6">
        <p className="text-muted-foreground">{description}</p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive" // most shadcn/ui themes make this red
            onClick={onConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}