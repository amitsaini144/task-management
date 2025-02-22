import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeToggler } from './ThemeToggler';


function Navbar() {

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur px-3 py-2">
      <div className="container mx-auto flex flex-row justify-between items-center px-0">
        <Link href="/" className="text-xl font-bold">
          Project Management
        </Link>
        <div className='flex gap-1'>
          <ThemeToggler />
          <>
            <Link href="/signup">
              <Button variant={'ghost'}>SignUp</Button>
            </Link>
            <Link href="/signin">
              <Button variant={'ghost'}>LogIn</Button>
            </Link>
          </>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;