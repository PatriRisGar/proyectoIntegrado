import { Horse } from "./horse.model";

export interface MedicalHistory{
        key: string,
        horse: Horse,
        visitDate: Date,
        reason: string,
        diagnosis: string,
        tratment: string,
        vaccine: string,
}