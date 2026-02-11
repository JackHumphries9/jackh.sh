"use client";

import { useState, ChangeEvent } from "react";
import { sendMessageAction } from "@/app/contact/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "use-server-action";

type FormState = {
    name: string;
    email: string;
    message: string;
};

export default function ContactForm() {
    const [formState, setFormState] = useState<FormState>({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { id, value } = e.target;
        setFormState((prev) => ({ ...prev, [id]: value }));
    };

    const action = useServerAction({
        action: sendMessageAction,
        onSuccess: () => {
            setFormState({ name: "", email: "", message: "" });
            toast("Your message has been sent successfully", {
                icon: <Check />,
            });
        },
    });

    return (
        <form
            className="space-y-6 w-full md:max-w-md max-w-full"
            onSubmit={(e) => {
                e.preventDefault();
                action.execute(formState);
            }}
        >
            {action.isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {action.error ?? "Something went wrong."}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium pb-4">
                    Name
                </label>
                <Input
                    id="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Your name"
                    required
                    disabled={action.isPending}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Your email"
                    required
                    disabled={action.isPending}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium pb-4">
                    Message
                </label>
                <Textarea
                    id="message"
                    value={formState.message}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Your message"
                    rows={6}
                    required
                    disabled={action.isPending}
                />
            </div>
            <Button
                type="submit"
                loading={action.isPending}
                className="w-full bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 hover:dark:bg-gray-200 duration-400 cursor-pointer"
            >
                Send Message
            </Button>
        </form>
    );
}
