Pat’s JavaScript Programming Style Guide



These are personal preference style guides for how I like to write JavaScript. These are not hard and fast rules and can be disregarded for any number of reasons. Primarily these are to improve my own readability ad secondly for speed in execution and speed in development.



Naming Conventions

Defaults: All of the popular case style variants have a place but the default for most variables is camel case. This is probably the most common and easiest to read. I also prefer fully spelled out English words unless the variable is repeated many times. The shortened version should still signify the original word clearly. For example `msg` is a commonly used shortening of `message`.



For cached sub variables or sub functions I use a snake case style appended to the original. The most common use case is string length and array length. The following example illustrates this.



```

let encodedMessage = encodeURI(‘a-b-c’);

const encodedMessage_length = encodedMessage.length;

```



This makes it really obvious visually what this value is. I use this in most of my looping structures thatI’ll get to later.



Classes and IIFEs use Pascal case. This helps make them easy for me to recognize and also just feels right. Also this doesn’t always happen but it is nice if I can have one IIFE or class per file where the file name uses the kebab case version of the class  or IIFE name. File names in general will use kebab case since it is the expectation for html attributes and urls which do not always handle capitalization the same way.



Backend files prefer to use ES modules and end in .mjs so that node always executes them that way. This seems to give the most cross compatibility between different types of imported modules. It also gives me top level await.



Frontend files should be a single IIAFE that starts with `void async function PascalName(){

`  and end with `?.();` these make sure it is completely non blocking as much as possible and make it very obvious to me what it is doing. I also like to name the IIAFE files with the kebab case equivalents followed by `.v.js` so the above example would be `pascal-case.v.js` .



Looping structures I prefer to iterate with the `let i = 0; i < length; i++` style over `for each|in|of` because it is personally more readable to me, allows me to easily fine tune the iteration, and it is especially fast. I also cache the length if there is no good reason not to. Seeing the benchmarks on different looping structures has made it hard to not do this every time.



Another thing that benchmarking has instilled in me is division. I almost never divide by a constant value. Multiply by a decimal value instead. It is so much faster. So instead of `let y = x / 2;` do `let y = x * 0.5;` .



Semicolons are not optional in my book. They greatly improve readability. Use them when you end a statement.



Similarly if statements must use curly braces. It is just so much more readable. This may seem counterintuitive considering my dislike for piles of braces but ambiguity is even worse.



Never use `.then` when you can `await` a promise instead which is pretty much every time. This rule like others is to prevent the pile up of parenthesis and curly braces that are nowhere near any text that explains what they do. Piles of parenthesis are really hard to count and I don’t think I should have to. This also helps keep the order of execution stay from top to bottom.



Arrow functions are something that I forget to use most of the time because I wasn’t raised that way but they have definitely grown on me. There are some very specific cases where arrow functions really bother me in terms of readability and it is always in cases where there are no parameters because you just get a pile of parenthesis. People from other languages look at this and really hate it. There are a few things that really help with this. Even just one variable usually helps provide enough context to see what is going on. There are 3 main cases that I see where we can improve. 



The first is assigning a variable to a single line function. In this case the arrow function is used like a special assignment operator for a dynamic variable. For this I like to make it as concise as possible. Consider `let lessHeight =()=> window.innerHeight - 10;` here we see a dynamically assigned variable with a very short assignment but we can actually do better. `let lessHeight =Þ=> window.innerHeight - 10;` I like to use Þ because it is a rarely used letter, looks like a special operator, and makes it extremely obvious to me what I am trying to do.



The next is when passing a multi line arrow function as a variable. Usually this is as a callback variable. Without parameters this is vulnerable to leading to a parenthesis pile. For example you often see 



``` 
setTimeout(()=>{ 



//do a bunch of work



},1000);
```



Damn does this look ugly to me and it takes exactly the same amount of effort to write it like this



```
setTimeout(fn=>{





//do a bunch of work in a readable way





},1000);
```



Doesn’t that look so much better? It is way easier to see that this is the start of a function and not an ugly pile of curvy lines.



Similarly when assigning an arrow function to a variable we can do the same though it is not ac crucial since the variable name is there to provide context.



```
let myArrowFunction = fn => {



//do stuff



}
```



Hooray.





The third case is probably the least common but happen when you have a single like callback function that takes no variables and is not immediately assigned. To me in this case the action that is happening is more like returning a value than calling a function so use `rtrn`. Like `setTimeout(rtrn => window.innerHeight - 10, 1000);`. These are small but effective changes for making code more readable.
