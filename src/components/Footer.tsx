import Link from "next/link"
import { Icons } from './icons';
import { buttonVariants } from './ui/button';

function Footer() {
    return (
        <footer className="text-center p-4 border-t">
            <div className="flex flex-col gap-2">
                <p>© 2025 Task Management. All rights reserved.</p>
                <div className="flex justify-center gap-1">
                    <Link href={'https://github.com/amitsaini144/task-management'}
                        target="_blank"
                        rel="noreferrer">
                        <div
                            className={` ${buttonVariants({ variant: "ghost" })}`}
                        >
                            <Icons.gitHub className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </div>
                    </Link>

                    <Link href={'https://twitter.com/amitsaini_144'}
                        target="_blank"
                        rel="noreferrer">
                        <div
                            className={` ${buttonVariants({ variant: "ghost" })}`}
                        >
                            <Icons.twitter className="h-3 w-3 fill-current" />
                            <span className="sr-only">Twitter</span>
                        </div>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer