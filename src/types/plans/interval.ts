import type { Passage } from './passage';

export type Interval = {
    from: number;
    to: number;
    passages: Passage[];
};
