import xs, { Stream } from "xstream";

export default function makeWSDriver(url: string): () => Stream<MessageEvent> {
    const connection = new WebSocket(url);
    return () => { return xs.create<MessageEvent>({
        start: listener => {
            connection.onerror = (err) => {
                listener.error(err)
            }
            connection.onmessage = (msg) => {
                listener.next(msg)
            }
        },
        stop: () => {
            connection.close();
        },
        }).map(msg => {
            console.log(msg);
            return JSON.parse(msg.data);
        });
    }
  }