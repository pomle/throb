# Throb

Higher order functions to avoid race conditions, hammering, etc.

## derace

Ensures that only the most up to date call to a promise resolves.

### Usage

In the example below, we call a server to get the current time to display. If we did not use `derace`, an earlier call to `getTime` could resolve after the last, and show an outdated result.

```
import { derace } from "@pomle/throb";

function getTime() {
  return fetch("http://time/now");
}

const updateTime = derace(getTime);

setInterval(() => {
  updateTime()
    .then(time => {
      window.title = time;
    })
    .catch(error => {
      console.info(error);
    });
}, 1000);
```
