'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'

export const Account: React.FC<{
  defaultTab?: 0 | 1
  firstTab: React.ReactNode
  secondTab: any
}> = ({ defaultTab = 0, firstTab, secondTab }) => {
  const [currentTab, setCurrentTab] = useState<0 | 1>(defaultTab)

  return (
    <div className="flex w-full max-w-[430px] flex-col gap-2">
      <Switch currentTab={currentTab} setTab={setCurrentTab} />
      <div>
        {currentTab === 0 && firstTab}
        {currentTab === 1 && secondTab}
      </div>
    </div>
  )
}

const Switch: React.FC<{
  setTab: Dispatch<SetStateAction<0 | 1>>
  currentTab: number
}> = ({ setTab, currentTab }) => (
  <div
    className={`relative flex w-full items-center rounded-lg bg-neutral-100 py-1 text-neutral-900 dark:bg-neutral-800 dark:text-white`}>
    <motion.div
      transition={{ type: 'keyframes', duration: 0.15, ease: 'easeInOut' }}
      animate={currentTab === 0 ? { x: 4 } : { x: '98%' }}
      initial={currentTab === 0 ? { x: 4 } : { x: '98%' }}
      className={`absolute h-5/6 w-1/2 rounded-md bg-white shadow-sm dark:bg-neutral-950`}
    />
    <button
      onClick={() => {
        setTab(0)
      }}
      className="z-10 h-9 w-full rounded-md text-center">
      Sign in
    </button>
    <button
      onClick={() => {
        setTab(1)
      }}
      className="z-10 h-9 w-full rounded-md text-center">
      Sign up
    </button>
  </div>
)
