import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeToggler } from './ThemeToggler';


function Navbar() {

  return (
    <nav className="sticky top-0 z-50 border-b w-full backdrop-blur px-3 py-2 bg-background/50">
      <div className="container mx-auto flex flex-row justify-between items-center px-0">
        <Link href="/" className="text-xl font-bold">
          Task Management
        </Link>
        <div className='flex gap-1'>
          <ThemeToggler />
          <>
            <Link href="/signup">
              <Button
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800" variant={'ghost'}>SignUp</Button>
            </Link>
            <Link href="/signin">
              <Button
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800" variant={'ghost'}>LogIn</Button>
            </Link>
          </>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;