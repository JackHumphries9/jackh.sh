"use server";

import sendWebhook from "@/lib/discord_webhook";
import { z } from "zod";
import { serverAction } from "use-server-action/server";

const schema = z.object({
    email: z.email({
        error: "Invalid Email",
    }),
    name: z.string().min(2, "Name must be at least 2 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

async function action(
    data: z.input<typeof schema>,
): Promise<
    { success: true } | { success: false; errors: Record<string, string[]> }
> {
    const validatedFields = schema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0].message);
    }

    const { name, email, message } = validatedFields.data;

    await sendWebhook({
        embeds: [
            {
                title: "New Website Message",
                description: `From ${name} (${email})\n\n>${message}`,
            },
        ],
    });

    return { success: true };
}

export const sendMessageAction = serverAction(action);
