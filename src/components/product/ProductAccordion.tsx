'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  title: string
  content: string
}

interface ProductAccordionProps {
  items: AccordionItem[]
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-gray-200 border-t border-gray-200">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="flex items-center justify-between w-full py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-sm text-gray-800">{item.title}</span>
            {open === i ? <Minus size={16} className="text-gray-400" /> : <Plus size={16} className="text-gray-400" />}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
