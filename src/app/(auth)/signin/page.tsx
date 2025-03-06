"use client";

import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/zodValidation";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from "react";
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [isloading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleSignIn = async (data: z.infer<typeof signInSchema>) => {

        setIsLoading(true)
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        if (result?.error && result.error === 'Error: Incorrect password') {
            setIsLoading(false)
            toast.error("Incorrect password");
        } else if(result?.error && result.error === 'Error: No user found with this email') {
            setIsLoading(false)
            toast.error("User not found with this email");
        } else {
            toast.success('Login Successful');
            setIsLoading(false)
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-12 sm:px-6 lg:px-8">
            <div className="border px-8 py-6 flex flex-col gap-4 rounded-lg shadow-md w-full max-w-sm">    
                <h2 className='text-center text-3xl font-bold'>Sign In</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} name="email" className="dark:bg-black/0 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} name="password" className="dark:bg-black/0 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isloading}>
                            {isloading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}