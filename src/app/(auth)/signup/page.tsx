"use client";

import * as z from 'zod';
import axios from "axios";
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
import { signUpSchema } from "@/schemas/zodValidation";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"
import { signIn } from 'next-auth/react';

export default function SignIn() {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const signUpMutation = useMutation({
        mutationFn: (userInfo: z.infer<typeof signUpSchema>) => axios.post("/api/signup", userInfo),

        onSuccess: async (response, variables) => {
            toast.info(response.data.message);

            await signIn('credentials', {
                email: variables.email,
                password: variables.password,
            });
        },
        onError: (error) => {
            console.error(error);
        },
    })

    const handleSignUp = (data: z.infer<typeof signUpSchema>) => {
        signUpMutation.mutate(data);
    }

    return (
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-12 sm:px-6 lg:px-8">
            <div className="border p-8 flex flex-col gap-4 rounded-lg shadow-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input className="dark:bg-black/0 bg-slate-50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button type="submit" className='w-full' disabled={signUpMutation.isPending}>
                            {signUpMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}