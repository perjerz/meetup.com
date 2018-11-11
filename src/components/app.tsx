import xs, { Stream } from 'xstream';
import { extractSinks } from 'cyclejs-utils';
import isolate from '@cycle/isolate';

import { driverNames } from '../drivers';
import { Sources, Sinks, Reducer, Component } from '../interfaces';
import { Meetup } from './meetup';

export interface State {}

export function App(sources: Sources<State>): Sinks<State> {
    const match$ = sources.router.define({
        '/': Meetup
    });

    const componentSinks$: Stream<Sinks<State>> = match$
        .filter(({ path, value }: any) => path && typeof value === 'function')
        .map(({ path, value }: { path: string; value: Component<any> }) => {
            return value({
                ...sources,
                router: sources.router.path(path)
            });
        });

    const sinks = extractSinks(componentSinks$, driverNames);
    return {
        ...sinks,
        router: xs.merge(xs.of('/'), sinks.router)
    };
}
