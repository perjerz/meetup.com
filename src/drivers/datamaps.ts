import xs, { Stream } from "xstream";

declare var Datamap: any;
declare var fadingBubbles: any;

export default function makeDatamap(meetup$: Stream<any>): void {
    const datamaps = new Datamap({
        scope: 'World',
        element: document.getElementById('map'),
        projection: 'equirectangular',
        height: 500,
        fills: {
        defaultFill: '#F1EBF4',
            lt50: 'rgba(0,244,244,0.9)',
            gt50: '#20438A',
        },
        geographyConfig: {
            highlightFillColor: '#bfdfec',
            highlightBorderColor: 'white',
        }
    });
    datamaps.addPlugin('fadingBubbles', fadingBubbles);
    meetup$.addListener({
        next: meetup => {
            console.log(meetup);
            if(meetup) {
                datamaps.fadingBubbles([meetup]);
            }
        }
    });
  }