import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';

import { Sources, Sinks, Reducer } from '../interfaces';

export interface State {
    newMeetup?: { latitude: number; longitude: number };
}
export const defaultState: State = {
    newMeetup: undefined
};

interface DOMIntent {
    updateMeetups$: Stream<null>;
    link$: Stream<null>;
}

export function Meetup({
    DOM,
    state,
    webSocket: meetup$
}: Sources<State>): Sinks<State> {
    const { link$ }: DOMIntent = intent(DOM);
    return {
        DOM: view(state.stream),
        state: model(meetup$),
        router: redirect(link$),
        dataMap: updateMap(state.stream)
    };
}

function model(meetup$: Stream<any>): Stream<Reducer<State>> {
    const init$ = xs.of<Reducer<State>>(prevState =>
        prevState === undefined ? defaultState : prevState
    );
    const updateMeetup: (meetup: any) => Reducer<State> = meetup => state => {
        const { venue } = meetup;
        if (venue) {
            const { lat: latitude, lon: longitude } = venue;
            return {
                ...state,
                newMeetup: { latitude, longitude }
            };
        }
        return {
            ...state
        };
    };
    const updateMeetup$ = meetup$.map(updateMeetup);
    return xs.merge(init$, updateMeetup$);
}

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(({ newMeetup }) => (
        <div>
            <h2>My Awesome Cycle.js app - Page 3</h2>
            <div id="map" />
            <span>{'Meetup: ' + newMeetup}</span>
            <button type="button" data-action="navigate">
                Page 1
            </button>
        </div>
    ));
}

function intent(DOM: DOMSource): DOMIntent {
    const updateMeetups$ = DOM.select('.add')
        .events('click')
        .mapTo(null);

    const link$ = DOM.select('[data-action="navigate"]')
        .events('click')
        .mapTo(null);

    return { updateMeetups$, link$ };
}

function redirect(link$: Stream<any>): Stream<string> {
    return link$.mapTo('/counter');
}

function updateMap(newMeetup$: Stream<any>): Stream<any> {
    return newMeetup$.map(meetup => meetup.newMeetup);
}
