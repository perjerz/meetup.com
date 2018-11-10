import { withTime, addPrevState } from 'cyclejs-test-helpers';
import { assertLooksLike, Wildcard } from 'snabbdom-looks-like';
import { mockDOMSource, VNode } from '@cycle/dom';

import { App } from '../src/components/app';
import { wrapMain } from '../src/drivers';

function fakeLocationObj(path: string): any {
    return {
        pathname: path,
        search: '',
        hash: '',
        locationKey: ''
    };
}

describe('app tests', () => {
    it(
        'should redirect to /meetup from /',
        withTime(Time => {
            const DOM = mockDOMSource({});
            const history = Time.diagram('r--r--', {
                r: '/'
            }).map(fakeLocationObj);

            const sinks = wrapMain(App)({ DOM, history } as any);

            const expected$ = Time.diagram('a--a--', {
                a: '/meetup'
            });

            Time.assertEqual(sinks.router!, expected$);
        })
    );
});
