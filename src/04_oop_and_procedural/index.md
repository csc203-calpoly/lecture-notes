# Objected-oriented Programming and Procedural Programming

> In this lesson, we'll compare and contrast two styles of programming, or *programming paradigms*: **procedural programming** and **object-oriented programming** (the latter being the focus of this course).

After this lesson, you will know about:

- The difference between procedural and object-oriented programs
- Constructors and overloaded constructors
- The difference between `static` members and instance members of a class
- The meaning and usage of the `this` keyword in Java

## Procedural and object-oriented programming

*Procedural programming* is a style of programming that focuses on providing a series of instructions to be executed.
These would the *statements* in the program.
A procedural program can also bundle up instructions into *functions* that can be used and re-used as needed.
Similarly, data can be bundled up into compound objects, simply for the purposes of packaging up related pieces of information.

Procedural programming was the dominant way of doing things until Object-oriented programming (OOP) was invented in the 70s and 80s.
As programming projects started to get larger and more complex, because software was quickly being integrated into many domains, software engineers started to run into problems with software maintainability.
In procedural programming, it is easy to get into a "spaghetti code" situation, where you have a large program with tons of functions operating on a number of data structures.
The onus is on the programmer to structure the program so that it would be easily readable, testable, and changeable.

One proposed solution was **Object-oriented programming** (OOP).

In OOP, instead of focusing our program on data and functions that operate on that data, we use *objects*, which bundle up related data and behaviours that operate on those data into *classes*.

Orienting our programs around objects (the argument goes) lets us modularise the various parts of a large software system, with each part only reading or affecting its own data. This leads to a number of beneficial effects:

- The amount of *global* data (data that is shared by multiple objects or parts of a system) is limited. By bundling up data into objects, and tending to make that data `private` by default, the programmers exerts a fair amount of control over who can see what parts of a system.
- Because we use `private` data and `public` functions to induce this degree of separation between parts of a system, those parts are *decoupled* from each other.
- Features we will learn later this quarter will show us that this also helps introduce a degree of *resilience to change* into our programs. Software requirements change often — if we are unable to change our software easily to meet new requirements, we're gonna have a bad time.

Of course, all of the above are hypothetical. It's perfectly possible to gain all of the above benefits using procedural programming, just like it is possible to write terrible, unmaintainable programs using OOP.

In this class, we're going to aim to understand the higher-level principles of good software design, using OOP as a vehicle to put those principles into practice.
This does *not* mean that those principles are unique to OOP.

This is a good time to note a few things!

- There are many conflicting views about both Java and object-oriented programming.
- This course is not meant to evangelise Java or object-oriented programming. It is *not* the "one true way" to develop maintainable software. But it is *one* way, and an important one. So it is worth learning.
- There are other programming paradigms, which you will learn and use in other courses and, indeed, later in this course itself.

Ok, let's look at examples! We'll look at the same super-simple program written in each of the two styles.

## Procedural programming

Consider the code below.

We have the `Pitcher` class, which is simply a bundle of data members. You can think of this as more-or-less like a `dict` in Python, or a `struct` in C.

The `Pitcher` class above *only* has data, and has no behaviours.
Unlike the `CsCohort` that we looked at in the previous lesson, the `Pitcher` cannot perform any actions itself, it cannot do anything using its data.
Any behaviours we want to perform must be written as separate functions — those functions will take the `Pitcher` object as a parameter, and perform actions using the `Pitcher`'s data.

{% include casdocs.html url="./PitcherProc.html" height="500px" %}
<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="PitcherProc.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="PitcherProc.html" width="100%" height="500px"></object>
</div>
</p>


Any behaviours that use the `Pitcher`'s data must be written in separate functions, which will take the `Pitcher` object as a parameter. Those are written in the `PitcherUtil` class.

<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="PitcherProcUtil.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="PitcherProcUtil.html" width="100%" height="350px"></object>
</div>
</p>


## Object-oriented programming

Here is the same program written in an Object-oriented style. Please take some time to read through the annotations within the source code.

<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Pitcher.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Pitcher.html" width="100%" height="1200px"></object>
</div>
</p>


### "static" data and methods

The code above also introduces the notion of `static` data.
Here, the word "static" is used slightly differently than in the phrase "statically-typed".
In this context, `static` means the value belongs to the _class_, as opposed to individual instance of the class.

So in the example below, since all baseball games are 9 innings long, the `INNINGS_PER_GAME` variable is marked `static`, and the value is shared by all `Pitcher` objects.

> **PONDER**
>
> Why don't we just give each `Pitcher` its own `inningsPerGame` instance variable and have its value be `9` for all `Pitcher`s?

Just like we can have both `static` and instance _variables_, we can also have both `static` and instance _methods_.
A `static` method would define behaviours that don't belong to or apply to any individual `Pitcher` object.

For example, you might have a `static` method that takes in a list of `Pitcher` objects (`List<Pitcher>`) and computes the average number of runs scored across all those `Pitcher`s.

That is, we could have the following method inside the `Pitcher` class:

```java
public static double averageRuns(List<Pitcher> pitchers) {
  double sum = 0;
  for (Pitcher p : pitchers) {
    sum = sum + p.runs();
  }

  if (pitchers.size() != 0) {
    return sum / pitchers.size();
  } else {
    return 0.0;
  }
}
```
> **PONDER**
>
> What would `this` refer to in the method above?[^this]


[^this]: There is no `this` inside a `static` method, since the method is not being called by any object. It's being called by the _class itself_. Any reference to `this` inside a `static` method would cause your code to not compile.

**Main takeaways regarding `static` methods.**

- `static` methods are useful when you are writing functions that don't necessarily apply to any individual object, or if the behaviour cannot reasonably be said to be _performed_ by any single object. Sometimes this will be ambiguous, and will come down to your preference.

- If you find yourself writing a `static` method whose parameters include a single object of a given type, you should consider whether the method would be better placed as an instance method for that type. The answer will often, but not always, be _yes_.

- Some folks tend to use `static` as an escape hatch from the Object-oriented paradigm. Sometimes this is appropriate. For example, you just want to write some useful reusable functions that don't necessarily belong to an object in a larger Object-oriented system. The [Math](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html) class in Java is a great example: it provides a number of useful functions for things like exponentiation, trigonometry, rounding, etc. All of these are written as `static` methods. Generally useful utility classes like that are one of the only situations in which that would be acceptable. If you find yourself reaching for `static` methods, you need to re-consider your design (or your programming paradigm).
