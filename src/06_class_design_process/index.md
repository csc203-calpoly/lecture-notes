# A class design process

> In this lesson we'll implement a simple game using an object-oriented (OO) design process.
> The goal is to get a tiny taste of the thought process that goes into designing an OO system with multiple interacting classes.

## Overview

We're going to implement the [Game of Nim](https://en.wikipedia.org/wiki/Nim). Lets start by first understanding the game we're building. The rules are simple:

- There are two players.
- There is a pile of sticks. We can let the players decide how many sticks should be in the pile to begin with.
- The players take turns removing 1–3 sticks from the pile. Each turn _must_ involve at least 1 stick being removed from the pile.
- The player that removes the last stick from the pile loses.

We're going to build this as a text-based game. Here is how an example game might go:

```txt
Player 1's name? Yaa
Player 2's name? Michael
How many sticks? 5
Yaa, how many sticks do you want to take? 2
Yaa takes 2 stick(s).
There are 3 left in the pile.
Michael, how many sticks do you want to take? 1
Michael takes 1 stick(s).
There are 2 left in the pile.
Yaa, how many sticks do you want to take? 1
Yaa takes 1 stick(s).
There are 1 left in the pile.
Michael, how many sticks do you want to take? 1
Michael takes 1 stick(s).
There are 0 left in the pile.
Yaa is the winner
```

## Why follow a principled design process?

Before we proceed, I want to acknowledge that the requirements, as described above, are fairly simple.
You could probably write the whole game in a couple hundred lines in a single file.

That is fine: we're still going to use an OO process to design and implement this game.
Remember, our goal is to learn to follow a principled design process when we engineer software.
OO design is one such process to help us write maintainable code.

But it's worth questioning: **what do we actually mean by that?** When I say we should prioritise _maintainability_, I'm thinking of the following:

**Requirements change over time.** Software requirements rarely stay the same. Either because the client (the person for whom we're building the software) refines what they're asking for, or because new features need to be added, or because we, the developers, are correcting initial misunderstandings about aspects of the requirements, change is a constant in software engineering.

**There will be bugs.** It's likely that you'll need to debug your program at some point. Decoupling the different modules involved in the overall game implementation will help to quickly isolate issues as well as the changes needed to resolve them. This is related to the previous point. If you are making changes all over your codebase to support every new feature or bug-fix or what have you, your likelihood of introducing more bugs increases significantly. The more interactions there are between the different modules involved, the larger the "search space" grows when you are trying to hunt down a bug.

**Testing.** Finally, you want to be able to test the distinct parts of your program to verify that they are working correctly, both individually and together. "[Spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code)" is much harder to test than smaller cohesive modules, in part because it becomes difficult to even tell what a "distinct part" of the program is.

All that to say: it pays to follow a principled software design process.
That is, we want to write **loosely coupled**, **tightly cohesive** components (where "components" can mean functions, classes, packages, etc.; I use "component" as a general term to emphasise that these principles are not unique to OOP).

- **Loose coupling**: Components can work together harmoniously, but are not dependent on each others' implementation details. If one component needs to change how it works, that should not beget changes in other components, or at least should minimise them.
- **Tight cohesion**: The above goal can be realised by writing components that *do one thing*. What that "one thing" is is dependent on the problem at hand. For example, we might have a component whose job it is to manage the user interface for the game (whether it is text-based or graphical) and a component whose job it is to manage the game logic.

### Detour: A small but important real-world example

Consider the **`String`** class in Java.

We casually think of a `String` as being a "string of characters".
This is how the `String` used to be implemented in older versions of Java in years past.
For example, the [Java 8 `String` implementation](https://github.com/openjdk/jdk8/blob/master/jdk/src/share/classes/java/lang/String.java#L114), used around 2014, has a `value` instance variable declared as a `char[]`.

However, the `char` data type can represent a large but limited set of possible characters in its two bytes of memory (the [UTF-16](https://en.wikipedia.org/wiki/UTF-16) encoding[^encodings]).
At some point, the Java standard library made the switch to where the `value` of a `String` is now represented by a much less restricted array of `byte`s instead.
See [the current `String` implementation](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/lang/String.java#L160).

[^encodings]: If you're curious, this blog post by Joel Spolsky (one of the creators of StackOverflow) is a good overview about character encodings: [_The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)_](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/).

Importantly, the `value` instance variable is marked as `private`, meaning that other code that used `String`s did not have direct access to this `value`, and therefore could not _rely_ on it being a `char[]`.
The maintainers were able to change this to be a `byte[]` with little fuss (that I'm aware of), because the "public-facing" surface of the `String` class remained the same as far as any outsiders were concerned.
They were _decoupled_ from the `String` class.

That said, the `String` class _does_ provide the `toCharArray` method, which still gives back a `char[]`.
Code that uses that method to obtain access to the underlying array of characters could possibly break if the `String` contained characters outside the UTF-16 encoding (e.g., emojis).

This should serve as a warning that you should carefully think about whether or not you should provide accessor methods for your `private` instance variables.
Many Java developers do it as an automatic step when creating new classes, but that defeats some of the purpose of information hiding.

## Designing the classes needed for the game

I find it useful to ask a series of questions to help me understand what it is I'm building.

What data do we need to keep track of to run this game? To what *entities* do those pieces of data belong? For what *behaviours* (functionality) is each entity responsible?

- For starters, we have the **Players**. Based on the recorded game output at the beginning of this lesson, what *data* do you think a `Player` should hold? What *behaviours* do you think a `Player` should be able to perform? For example, the `Player` ought to have a `name`, since that is what is used in the text-based output. The `Player` should also be able to remove a specified number of sticks from the pile. Leading us to...
- **The pile of sticks**. What are the data and behaviours here? The `Pile` should, at the very least, be able to keep track of how many `sticks` are left in it. It's also probably a good idea to prevent the removal of _too many_ or _too few_ sticks.
- Finally, we have **the game itself**. This is sort of the "controller" of this whole thing. What *data* does the `Game` know about? It needs to know about the `Player`s who are playing the game, and the `Pile` they are playing with. It also needs to manage the game logic, i.e., setting up the game, letting the players go turn-by-turn, and checking for a winner after each turn.

> **PONDER**
>
> In the game rules, a player must remove 1–3 sticks from the pile. This means we must not allow player turns in which the player tries to remove `< 1` stick or `> 3` sticks. Should this check be done by the `Pile`, the `Player`, or the `Game`? Why?<br><br>
> In this text based game, the `Player` might enter text that cannot be parsed into an `int` while choosing the number of sticks they want to pick up. How should this be handled? Whose job is it to handle it?

We will discuss the above together as a class.
That discussion should ideally give us an idea of what classes should exist in our system, and roughly what each of them should be responsible for.

Here is _one possible_ implementation of the game — we may come up with something different in class, or you may come up with something different on your own.
That is fine.

### The Player class

<!--{% include casdocs.html url="Player.html" height="700px" %}-->
<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Player.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Player.html" width="100%" height="700px"></object>
</div>
</p>


### The Pile class

<!--{% include casdocs.html url="Pile.html" height="600px" %}-->
<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Pile.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Pile.html" width="100%" height="600px"></object>
</div>
</p>


### The Game class

The `Game` class is our "controller" — it sits above and in-between the `Player` and `Pile` classes, managing and mediating those classes' communications with each other.

That is, the `Game` prompts the `Player` to see how many sticks they want to pick up, and sends that input to the `Pile`. The `Pile` acts on this information, updating its number of sticks accordingly. The `Game` then inspects the `Pile` to see if the game is over or not (by using the `Pile`'s getter method).

<!--{% include casdocs.html url="Game.html" height="100%" %}-->
<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Game.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Game.html" width="100%" height="1000px"></object>
</div>
</p>


## Supporting additional features

As we've said before, a central theme in software engineering is that your requirements can change.
For example, as you think about designing the game _as described above_, think about how easy or difficult it would be to support features like the following.
How much of our code would need to change to allow these features?

- **Multiple piles instead of a single pile.** Traditional versions of this game can involve _multiple piles_ of sticks, as opposed to just one. Users pick up sticks from one pile at a time, but the game ends when _all_ piles are empty.
- **Supporting a graphical user interface.** How much of our codebase needs to change to support a graphical user interface instead of (or in addition to!) a text-based interface?
- **Game history.** Suppose we want to be able to show a history of games that have been played, in the system as a whole and/or for individual players. How would our classes change?

You will find that there is a balance to be achieved between two extremes.
On one end, you can put in huge amounts of design effort upfront, and try to prepare your code to easily handle *any* updates to the requirements, i.e., by strictly adhering to principles like information hiding and creating new abstractions (e.g., classes) to support most key features.
The downside is that you often don't need all of those abstractions—that design and preparatory implementation work can go to waste[^yagni], and worse, it can make your code harder to read and understand for someone who is not already familiar with the codebase.

On the other extreme, you can eschew this upfront design work, and when changes to requirements inevitably _do_ crop up, you can pay the piper then. Though by that time you may have accrued a fair amount of *technical debt*.[^td]

[^yagni]: Many pithy acronyms for engineering principles hint at this, like [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) (you aren't gonna need it) and [KISS](https://en.wikipedia.org/wiki/KISS_principle) (keep it simple, stupid!)
[^td]: *Technical debt* is a metaphor describing the situation in which developers sacrifice some software maintenance tasks (like software design, testing, documentation, refactoring) in favour of speedy implementations and deployments. Sometimes this is fine, as long as that "debt" is repaid soon. *[A little debt speeds development so long as it is paid back promptly with refactoring.](https://www.agilealliance.org/wp-content/uploads/2016/05/IntroductiontotheTechnicalDebtConcept-V-02.pdf)*
