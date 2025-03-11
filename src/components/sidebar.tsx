import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Properties', href: '/properties', icon: BuildingOfficeIcon },
  { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Payments', href: '/payments', icon: BanknotesIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Tenants', href: '/tenants', icon: UserGroupIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-green-600">Scale-R PMS</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-gray-100 text-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Logged in as</p>
              <p className="text-xs text-gray-500">admin@scale-r.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 