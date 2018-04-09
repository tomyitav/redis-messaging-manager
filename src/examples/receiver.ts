import messenger from "./messenger";

console.log('consuming messages..!');
messenger.consume('redis')
    .subscribe(msg => {
        console.log('Got message- ', msg);
    });