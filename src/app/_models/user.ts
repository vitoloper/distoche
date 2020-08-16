import { Role } from "./role";

export class User {
    id: number;
    created_at: Date;
    modified_at: Date;
    role: Role;
    username: string;
    password: string;
    email: string;
    nome: string;
    cognome: string;
    sesso: string;
    data_nascita: Date;
    citta_residenza: string;
    short_bio: string;
    profile_img_url: string;
    enabled: boolean;
    token?: string; // JWT token (? means optional property)
}
