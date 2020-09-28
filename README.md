# Turbulen Test

![Diagram](./Diagram.png 'Diagram')

### Installation

```bash
  yarn install
  yarn dev # to start websocket server
  yarn scheduler # to start scheduler service
```

### What I can improve if have more time

- [ ] Clustering Redis or use to another type of persitent database. Because redis is not real presistent database, even it dumps data every specify of time, then reload it when server restarts. however it still may lost data.
- [ ] Convert project to monorepo using nx or lerna
- [ ] Dockerize project
- [ ] Configure haproxy for websocket services
- [ ] Add a application layer to parse format type of message. For example: Message can be `/add <name> at <time>` or parse message using NLP service such as _dialogflow_
- [ ] Add authenticate for websocket
