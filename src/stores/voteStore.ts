import { atom } from 'nanostores';

export const voteTrigger = atom(0);

export function triggerVoteUpdate() {
    voteTrigger.set(voteTrigger.get() + 1);
}
