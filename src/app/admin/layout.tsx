import { headers } from 'next/headers'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminProviders } from '@/components/admin/AdminProviders'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const isAuthenticated = headersList.get('x-admin-auth') === '1'

  if (!isAuthenticated) {
    return <AdminProviders>{children}</AdminProviders>
  }

  return (
    <AdminProviders>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </AdminProviders>
  )
}
