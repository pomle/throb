# Throb

Higher order functions to avoid race conditions, hammering, etc.

- [`debounce`](#debounce)
- [`derace`](#derace)
- [`knock`](#knock)
- [`retry`](#retry)
- [`throttle`](#throttle)
- [`turnstyle`](#turnstyle)

## `debounce`

Ensures a function is only executed if it has not been called again during some time.

### Usage

In the example below, we search as the user types. We only want to make a network request if the user stops typing, so that there is not one request per keystroke.

```ts
import { debounce } from "@pomle/throb";

function search(query: string) {
  return fetch("http://search.com/query=" + query).then((result) => {
    console.log(result);
  });
}

const handleType = debounce(search, 500);

document.querySelector("#search").addEventListener("input", (event) => {
  handleType(event.target.value);
});
```

## `derace`

Ensures that only the most up to date call to a resolved promise is used.

### Usage

In the example below, we call a server to get the current time to display. If we did not use `derace`, an earlier call to `getTime` could resolve after the last, and show an outdated result. If an outdated promise resolves, the `sync` flag will be false, and the result can be ignored and the desync logged.

```ts
import { derace } from "@pomle/throb";

function getTime() {
  return fetch("http://time/now");
}

const updateTime = derace(getTime);

setInterval(() => {
  updateTime()
    .then(([time, sync]) => {
      if (sync) {
        window.title = time;
      } else {
        // Unsynced resolves may also be ignored or logged.
        throw new Error("Out of sync");
      }
    })
    .catch((error) => {
      console.info(error);
    });
}, 1000);
```

## `knock`

Prevents calling function until it has been attempted to be called a number of times.

### Usage

Example below shows an overlay when the user moves pointer over screen. In order to avoid being overly sensitive to movement, we ignore the 5 first events. We then forget that movement after 2000 ms of inactivity.

```ts
import { knock } from "@pomle/throb";

function handlePointer() {
  document.body.classList.add("overlay");
}

const threshold = 5;
const remember = 2000;

const onPointerMove = knock(handlePointer, threshold, remember);

window.addEventListener("pointermove", onPointerMove);
```

## `retry`

Retries calls to a function according to specified backoff time pattern until it resolves.

### Usage

When fetch returns a response with a non-successful status code, sometimes it can make sense to retry the request. This example shows how to 
wrap `fetch`, and have it retry the request 3 times, waiting first 100 ms, then 200 ms, and finally 500 ms, before giving up.

The wrapped promise will resolve the original resolution if promise chain resolves, or throw array with accumulation of errors in array.

```ts
import { retry } from "@pomle/throb";

function filterBad(response: Response) {
  if (response.status === 500) {
    throw new Error("Server Error");
  }
  return response;
}

const fetchWithRetry = retry((request: Request) => {
  return fetch(request)
    .then(filterBad);
}, [100, 200, 500]);

fetchWithRetry("http://backend.api/data")
.then(response => {
  console.log("Success");
})
.catch((errors) => {
  console.warn("Retry attempts exhausted with following errors", errors);
});
```

## `throttle`

Ensures a function is executed exactly once per interval if called.

### Usage

In the example below, we log the pointer position every time it is moved, and send to a server every half second at most.

```ts
import { throttle } from "@pomle/throb";

const buffer: number[] = [];

function flush() {
  const data = [...buffer];
  buffer.length = 0;

  return fetch("http://backend.com/data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

const readyToSend = throttle(flush, 500);

document.addEventListener("pointermove", (event) => {
  buffer.push(event.clientX);
  readyToSend();
});
```

## `turnstyle`

Synchronously ensure only a single asynchronous call is in flight at any given time. Returns Promise if the call was allowed, otherwise `undefined`.

### Usage

When saving data to a backend, you want to avoid multiple requests originating from user error. Accidentally clicking twice on a button could produce an error. Use turnstyle wrapper to ignore calls to a function while a Promise is in flight.

```ts
import { turnstyle } from "@pomle/throb";

function saveData(data: any) {
  return fetch("http://backend.com/data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

const saveSafe = turnstyle(saveData);

document.querySelector("button").addEventListener("click", (event) => {
  const promise = saveSafe({ name: "Turtles" });
  if (!promise) {
    alert("Take it easy");
    return;
  }

  promise
    .then(() => {
      alert("Data was saved");
    })
    .catch(() => {
      alert("Data saved failed");
    });
});
```
