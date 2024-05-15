import { TrainingPlan } from "./tainingPlan";

export type Training = {
    plan: TrainingPlan;
    from: Date;
    progress: object;
}
