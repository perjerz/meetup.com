import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

import { Sources, Sinks, Reducer } from '../interfaces';

export interface State {
    newMeetup?: any;
}
export const defaultState: State = {
    newMeetup: undefined
};

export function Meetup({
    state,
    webSocket: meetup$
}: Sources<State>): Sinks<State> {
    return {
        DOM: view(state.stream),
        state: model(meetup$),
        dataMap: updateDatamap(state.stream)
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
                newMeetup: { ...meetup, latitude, longitude }
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
    return state$.map(({ newMeetup }) => {
        if (newMeetup) {
            const {
                event: { event_name, event_url },
                member: { member_name, photo },
                response
            } = newMeetup;
            return (
                newMeetup && (
                    <div>
                        <div>
                            <b>Meetup name:</b> {event_name}
                        </div>
                        <a href={event_url}>{event_url}</a>
                        <div style={{ height: '100px', overflow: 'hidden' }}>
                            <img src={photo} />
                        </div>
                        <div>{member_name}</div>
                        <div>Response: {response}</div>
                    </div>
                )
            );
        }
        return <div />;
    });
}

function updateDatamap(newMeetup$: Stream<any>): Stream<any> {
    return newMeetup$.map(({ newMeetup: newMeetupLocation }) => {
        if (newMeetupLocation) {
            return newMeetupLocation;
        }
        return null;
    });
}
