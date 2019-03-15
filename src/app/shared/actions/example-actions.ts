import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ClassActionTypes {
    Verb1 = '[Class] Verb1',
    Verb2 = '[Class] Verb2'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Verb1 implements Action {
    readonly type = ClassActionTypes.Verb1;

    constructor(public payload: any) { }
}

export class Verb2 implements Action {
    readonly type = ClassActionTypes.Verb2;

    constructor(public payload: any) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ClassActions
                        = Verb1
                        | Verb2;
