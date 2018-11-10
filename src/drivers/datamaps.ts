import xs, { Stream } from 'xstream';

declare var Datamap: any;
declare var fadingBubbles: any;

export default function makeDatamap(meetup$: Stream<any>): void {
    const datamaps = new Datamap({
        element: document.getElementById('map'),
        responsive: true,
        fills: {
            defaultFill: '#6d65ac'
        },
        geographyConfig: {
            highlightFillColor: 'rgba(109, 101, 172, .8)',
            highlightBorderOpacity: 0
        },
        scope: 'world',
        projection: 'equirectangular'
    });
    datamaps.addPlugin('fadingBubbles', fadingBubbles);
    meetup$.addListener({
        next: meetup => {
            if (meetup) {
                datamaps.fadingBubbles([meetup]);
            }
        }
    });
}
