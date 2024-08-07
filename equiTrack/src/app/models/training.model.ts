import { User } from "./user.model";
import { Horse } from "./horse.model";

export interface Training {
    key: string,
    trainer: User,
    rider: User,
    groom: User,
    horse: Horse,
    dateTraining: Date,
    trainingType: string,
}