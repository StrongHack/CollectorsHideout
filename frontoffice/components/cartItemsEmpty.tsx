"use client"

import Link from "next/link"
import { Plus, XCircle } from "lucide-react"
import { Button } from "@nextui-org/react"

export function CartItemsEmpty() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border-2 border-dashed border-gray-500 text-black bg-gray-300">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <XCircle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No collectables added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Add collectables to your cart.
        </p>
        <Link href="/collections">
          <Button size="sm" className="relative bg-teal-700 text-white hover:bg-teal-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Collectables
          </Button>
        </Link>
      </div>
    </div>
  )
}