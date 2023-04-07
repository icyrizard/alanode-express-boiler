export interface JwtUserDecoded {
    id: number;
    email: string;
    username: string;
    role: string;
}

export interface JwtAuthDecoded {
    iat: number,
    exp: number;
    user: JwtUserDecoded,
}