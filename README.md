# Throb

Higher order functions to avoid race conditions, hammering, etc.

## derace

Ensures that only the most up to date call to a promise resolves.

### Usage

In the example below, we call a server to get the current time to display. If we did not use `derace`, an earlier call to `getTime` could resolve after the last, and show an outdated result. If an outdated promise resolves, it the promise will throw. Thus, outdated results will end up in the catch clause.

```ts
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


## debounce

Ensures a function is only executed if it has not been called again during a some time.

### Usage

In the example below, we search as the user types. We only want to make a network request if the user stops typing, so that there is not one request per keystroke.

```ts
import { debounce } from "@pomle/throb";

function search(query: string) {
  return fetch("http://search.com/query=" + query)
    .then(result => {
      console.log(result);
    });
}

const handleType = debounce(search, 500);

document.querySelector("#search").addEventListener("input", (event) => {
  handleType(event.target.value);
});
```

