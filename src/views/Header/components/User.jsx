'use client'

import React, { useContext, useState } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { User as UserIcon, Link2, UserCircle, Settings as SettingsIcon, LogOut } from "lucide-react"
import { useOutsideClick } from "@/util"
import { AppContext } from "../../../../app/providers"
import { Button } from "@/components"

const MENU_ITEMS = [
  { href: '/accounts', label: 'Linked Accounts', icon: Link2 },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
]

const User = () => {
  const router = useRouter()
  const { user, setUser } = useContext(AppContext)
  const [opened, setOpened] = useState(false)
  const outsideClick = useOutsideClick(() => setOpened(false))

  const signOut = () => {
    setUser({})
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div id="user" ref={outsideClick} className="relative">
      <div>
        {Object.keys(user).length ? (
          <div
            className="w-[45px] h-[45px] rounded-full overflow-hidden cursor-pointer z-[1] text-center relative ml-4 bg-black/20 dark:bg-white/10"
            onClick={() => setOpened(true)}
          >
            {user.avatar
              ? <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} loading="lazy" width={45} height={45} className="w-full h-full object-cover" />
              : <UserIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px]" />
            }
          </div>
        ) : (
          <Button type="link" onClick={() => router.push('/signin')} >
            Sign in
          </Button>
        )}
      </div>

      {!!Object.keys(user).length && (
        <div
          className={`${
            opened ? 'block' : 'hidden'
          } absolute top-20 right-8 w-[250px] overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark border border-border-light dark:border-border-dark`}
        >
          <div className="px-4 pt-4 pb-0 text-center">
            <div className="relative mx-auto mb-5 w-[60px] h-[60px] rounded-full overflow-hidden bg-black/20 dark:bg-white/10 cursor-default">
              {user.avatar
                ? <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} loading="lazy" width={60} height={60} className="w-full h-full object-cover" />
                : <UserIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px]" />
              }
            </div>

            <div className="font-semibold text-black dark:text-white">{`${user.firstName} ${user.lastName}`}</div>
            <div className="mt-1 opacity-50 text-black/80 dark:text-white/80">{user.username}</div>
          </div>

          <ul className="list-none mt-5 mb-0 p-0">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href} className="px-4 cursor-pointer hover:bg-accent/40 dark:hover:bg-black/50">
                  <Link
                    href={item.href}
                    onClick={() => setOpened(false)}
                    className="flex items-center gap-3 py-4 border-t border-border-light dark:border-border-dark text-black dark:text-white"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
            <li
              onClick={() => signOut()}
              className="px-4 cursor-pointer hover:bg-accent/40 dark:hover:bg-black/50"
            >
              <span className="flex items-center gap-3 py-4 border-t border-border-light dark:border-border-dark text-[#b23b3b]">
                <LogOut size={18} />
                <span>Sign out</span>
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default User