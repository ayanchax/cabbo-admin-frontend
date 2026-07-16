import React from 'react'
import {APP} from "@/utils"
import { NavigationItems } from './NavigationItems'
import { DisplayAccount } from './DisplayAccount';
function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <img
            src={import.meta.env.VITE_APP_LOGO_URL}
            alt={APP.name}
            className="h-8 w-auto object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Workspace
          </p>
          <div className="mt-2 space-y-1">
            <NavigationItems/>
          </div>
        </nav>
        
        <DisplayAccount showLogout/>
         
      </aside>
  )
}

export  {AppSidebar}