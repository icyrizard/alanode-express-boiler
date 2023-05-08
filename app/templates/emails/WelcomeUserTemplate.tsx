import * as React from 'react';
import { User } from "@prisma/client";

export function WelcomeUserTemplate({ user }: { user: User }) {
    return <html>
        <body>
            <h2>Dear {user.firstName} {user.lastName}</h2>
            <h3 style={{color: 'green'}}>Welcome!</h3>

            <p>Cheers,</p>
            <p>Alanode</p>
        </body>
    </html>
}