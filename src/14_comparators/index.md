# Comparators

## Overview

This lesson provides more information about `Comparator`s in Java.
While conceptually simple, `Comparator`s are also used here as a vehicle to introduce a number of new concepts and syntaxes that may be unfamiliar.
Specifically, in this lesson we will:

- Recap what we learned about `Comparator`s in the previous lesson.
- Learn about _lambdas_, using `Comparator`s as a concrete usage example.
- Learn about _method references_, using `Comparator`s as a concrete usage example.

The next lesson will dive into lambdas more deeply and _functional interfaces_ more generally.

## Recap

In the [previous lesson](../13_comparables/), we learned about the `Comparable` and `Comparator` interfaces.
To recap the main difference between the two:

- The `Comparable` interface is used to define a "natural ordering" for objects of a given type. If you need to define an ordering for some data type (class) you have created, then you make that class implement the `Comparable` interface. This allows you to make instances of that class *comparable* to each other. A class that implements `Comparable` must implement a `compareTo` instance method.
- The `Comparator` interface is used to define orderings for classes that _don't_ have a natural ordering, or to define orderings in addition to a class's natural ordering. This is useful when you are defining a comparison to help solve a particular problem. `Comparators` are usually not defined as instance methods for the objects being compared.

We worked with an `Album` class that had the following fields.
We'll continue with the same example in this lesson.

- `String title`
- `String artist`
- `int year`
- `double price`

(Assume that we have defined getter methods for all the instance variables above.)

There are many ways of defining `Comparator`s in Java.
We will explore them in this lesson, starting with the most basic (repeated from the previous lesson), and then consider some more convenient alternatives.

## Defining a `Comparator` in a separate class

Recall that the `Comparator` interface defines one abstract method: `public int compare(Album a1, Album a2)`.

The simplest way to create a `Comparator` for `Album` objects is to create a separate class that implements the `Comparator` interface.

Let's consider a comparator that compares albums by their `title`.

```java
// The Comparator interface only has one abstract method
public class AlbumTitleComparator implements Comparator<Album> {

  public int compare(Album a1, Album a2) {
    return a1.getTitle().compareTo(a2.getTitle());
  }
}
```

The `Comparator` above can be used in functions like `Collections.sort` like below.
We create a new instance of the comparator object, and pass that object as a second parameter to the `sort` function.

```java
List<Album> albums = ...; // Assume this list is populated

Comparator<Album> titleComp = new AlbumTitleComparator();
Collections.sort(albums, titleComp);
```

This version of the `sort` function will now use the specified comparator for the pairwise comparisons during the sorting process.
As a result, the list of albums will be sorted by the title name in ascending order.

In essence, we have *parameterised* the comparison procedure in the `sort` function, thereby making the `sort` function more generally usable.
Because we tell it what comparator to use, the same `sort` function can be used to sort objects using _any ordering we define_.
We only need to define comparators and pass them to the function as parameters.

## Lambdas

In the example above, we created a whole new class (`AlbumTitleComparator`) just to define a single function (the `compare` function).
What's more, we created a new instance of the comparator only to pass it to the `sort` function.
We never called the `compare` function ourselves.

All this to say: all we _really_ care about in that comparator class is the `compare` function.
Can we define it separately, instead of wrapping it in a class and creating a new object to hold the function?

This is where the *lambda* syntax comes in. Lambdas have the following basic "anatomy":

```
(<params>) -> <lambda body>;
```

> A lambda is an anonymous function.

Since the lambda is a function, it has inputs (`<params>`) and it has a body (`<lambda body>`).
But, since it's anonymous, it doesn't have a name.
And this is okay!
The _writer_ of a lambda is usually not the one who _calls_ the lambda, so we often don't need to name the function.

However, we *can* store the lambda in a variable that has a name, or we can pass lambdas to other functions as parameters.

### Writing a comparator using a lambda

With that in mind, let's take a look at what a comparator looks like expressed as a lambda.
We'll start simple, by defining a comparator that only compares `Album`s by their `title`.

When we create `Comparator`s, what we're _really_ trying to create is a `compare` function.
Lambdas allow us to do that without going through the steps of creating a new class that implements the `Comparator` interface.
The key thing is that our compiler still thinks of the resulting comparator as a `Comparator` object.

The code below defines a `Comparator` using the lambda syntax.
This code is considerably more concise than the previous example — in particular, we don't need to create a new class.
This `titleComp` comparator can be used in the same way as the previous example.

```java
Comparator<Album> titleComp = (a1, a2) -> a1.getTitle().compareTo(a2.getTitle());
```

Let's break down the code above.

- **`Comparator<Album> titleComp`** — Everything on the left-hand-side of the variable assignment should be familiar. We are declaring a variable of type `Comparator<Album>` called `titleComp`. This part is the same whether or not we use the lambda syntax.
- Everything on the right-hand-side of the variable assignment is the *lambda*. In particular, the lambda represents the `compare` function.
  - **`(a1, a2)`** — These are the two parameters to the `compare` function. Observe that we don't need to specify the types of the parameters `a1` and `a2`. Because the lambda is being declared as a comparator of `Album`s, the compiler can infer these types.
  - **`->`** — This is the separator between the lambda's parameters and the function body.
  - **`a1.getTitle().compareTo(a2.getTitle())`** — This expression[^expression] is the body of the lambda. The expression as a whole evaluates to an `int`. Remember that the `compare` function _must_ return an `int`, so if this expression evaluates to anything but an `int`, your program won't compile.

In most cases, lambdas are single-line functions that return values.
If a lambda has only one line, and that line is an expression, there is no need to use the `return` keyword.
The value of that expression is returned implicitly.

[^expression]: Recall that an *expression* is anything that evaluates to a value.

We can write same lambda in "long form":

```java
Comparator<Album> titleComp = (Album a1, Album a2) -> {
  return a1.getTitle().compareTo(a2.getTitle());
}
```

By using curly braces in the lambda, we can write functions that include multiple lines.
This is sometimes necessary, e.g., if you need to write code that uses loops.
At that point, the lambda starts to look like a "plain old function", and you need to explicitly use the `return` keyword to return a value.

The lambdas above can be used in the same way we've already seen.
For example, if we want to sort a list of albums by title:

```java
List<Album> albums = ...; // Assume this list is populated

// Create the comparator using the lambda syntax
Comparator<Album> titleComp = (a1, a2) -> a1.getTitle().compareTo(a2.getTitle());

// Pass the comparator to the sort function
Collections.sort(albums, titleComp);
```

In the example above, the comparator is a _value_ that is passed to the `sort` function as a parameter.
You can write the function without first storing it in the `titleComp` variable.

```java
Collections.sort(albums, (Album a1, Album a2) -> a1.getTitle().compareTo(a2.getTitle()));
```

This time we _do_ need to specify the types of `a1` and `a2`, because this time the compiler doesn't have clues from which to infer the the types of those parameters.

### More lambda examples

#### Compare albums by year (an `int`)

Here is an example comparator that would compare two `Album`s by `year`.

```java
Comparator<Album> yearComp = (a1, a2) -> a1.getYear() - a2.getYear();
```

> **PONDER**
>
> Why does the code above work as a year comparator?

<details>
<summary>Hint</summary>

The `compare` function needs to return a positive integer if `a1`'s `year` is greater than `a2`'s `year`; a negative number `a1`'s `year` is less than `a2`'s `year`; and 0 if they are equal. We don't care what the actual returned values are, as long as their signs are correct. Simply subtracting the two years successfully computes such an integer.

</details>

#### Compare albums by price (a `double`)

> **PONDER**
>
> If we need to compare `Album`s by `price`, which is declared as a `double`, we can't simply compute the difference between the two prices.
> Why do you think this is?

<details markdown="1">
<summary>Hint</summary>
[The result of this difference will be a `double`](../02_arithmetic_and_testing/), which does not match the required signature for the `compare` function.
</details>
So we _could_ write the function in "long form":

```java
Comparator<Album> priceComp = (a1, a2) -> {
  if (a1.getPrice() > a2.getPrice()) {
    return 1; // or any positive integer
  } else if (a1.getPrice() < a2.getPrice()) {
    return -1; // or any negative integer
  } else {
    return 0;
  }
}
```

Alternatively, the [boxed primitive types](../03_lists_maps_existing_classes#boxed-primitives) provide a handy static function meant to do just this.
The above comparator can be written as:

```java
Comparator<Album> priceComp = (a1, a2) -> Double.compare(a1.getPrice(), a2.getPrice());
```

The `Double.compare` function returns a positive number, negative number, or 0, as appropriate for its two given parameters.
Similarly, other primitive types provide similar static functions, e.g., `Long.compare`, `Float.compare`, etc.

## Method references / key extractors

Finally, we can use the _method reference_ or _key extractor_ syntax.

You already know what _methods_ are in Java.
You can _call_ or _invoke_ or _apply_ methods on objects.
For example, `obj.someMethod()` will call `someMethod()` on the `obj` object.

However, it is also possible to simply "refer to" instance methods in Java, *without* calling them.
We do this using the method reference or "key extractor" syntax.

For example,

- To refer to an instance method on a particular object, you would use: `obj::instanceMethodName`, where `obj` is some object you have created, and `instanceMethodName` is an instance method for that particular object.
- To refer to an instance method for any arbitrary object of a particular type, you would use `ClassName::instanceMethodName`, where `ClassName` is the name of a class, and `instanceMethodName` is an instance method in the class.

These are useful because sometimes you end up creating lambdas that do nothing but call an existing method on an object.
In these cases, it's easier and simpler to simply "point to" the method you want to call instead of creating a lambda that takes a parameter and calls an existing named method on that parameter.

### Creating a comparator using a method reference

The `Comparator` interface provides a `Comparator.comparing` static method.
The `Comparator.comparing` method takes **a lambda** OR **a method reference** as a parameter.

If you give it a lambda, you define the lambda to follow the `compare` function signature.
You are more-or-less doing what we've already done above.

If you give it a method reference, you "point to" the method in the class that you want the comparator to use in its comparison, and it uses that method to create a `compare` function.

So here's the third and final way in which we can create comparators:

```java
Comparator<Album> titleComp = Comparator.comparing(Album::getTitle);
```

A few things to notice about the code above:

- There are no parentheses (`()`) after the `getTitle`, because we are not _calling_ the method; we are only referring to it.
- We use the key extractor to tell the `Comparator.comparing` method to create a new `Comparator` that calls `getTitle` on each of its parameters, and compares the results.
- It's important that our method reference refers to a method that returns a `ComparABLE` value (e.g., a `String`, a primitive type, any class you create that implements `Comparable`). If the method we refer to returns some type that cannot be compared, then we can't rely on this shorthand, because Java won't know how to compare them.

## Chaining comparators

Remember `default` methods?
The `Comparator` defines a bunch of really useful `default` methods.
These methods are instance methods that exist on all `Comparator` objects (just like you've learned about `default` methods).

We know that the `Comparator` interface only defines one abstract method: `compare`.


### `thenComparing`

The `thenComparing` function lets us combine multiple comparators to create "composed" comparators.
For example, to deal with tie-breakers.

Suppose we want to compare `Album`s by `artist` name, and then for `Album`s with the same `artist` name, we want to compare them based on their `title`.
We can use the `thenComparing` function to chain an **artist comparator** and a **title comparator**.
The result will be a _third_ comparator that is the combination of the previous two.

Like `Comparator.comparing`, `thenComparing` can take either a **lambda** or a **method reference** as a parameter, and returns a `Comparator` instance.

```java
// Written step-by-step
Comparator<Album> artistComp = Comparator.comparing(Album::getArtist);
Comparator<Album> titleComp = Comparator.comparing(Album::getTitle);
Comparator<Album> artistTitleComp = artistComp.thenComparing(titleComp);

// Written in one statement
Comparator<Album> artistTitleComp = Comparator.comparing(Album::getArtist).thenComparing(Album::getTitle);

// Sort albums by artist name, and sort by title for albums by the same artist
Collections.sort(albums, artistTitleComp);
```

This is a concise and convenient way to quickly chain together multiple comparisons to create complex comparison criteria.
Because `thenComparing` returns a `Comparator`, you can chain together several `thenComparing` calls.

### `reversed`

Another handy `default` method on `Comparator`s is the `reversed` method.
It simply reverses the `Comparator` object on which it is called, and returns a new `Comparator`.

```java
// Written step-by-step
Comparator<Album> titleComp = Comparator.comparing(Album::getTitle);
Comparator<Album> reversed = titleComp.reversed();

// Written in one statement
Comparator<Album> reversed = Comparator.comparing(Album::getTitle).reversed();

// Sort albums in DESCENDING ORDER of title
Collections.sort(albums, reversed);
```

Like `thenComparing`, `reversed` also returns a `Comparator` object.
This means that calls to `reversed` and `thenComparing` can be chained together to create various comparison combinations.

> **DISCUSS**
>
> How would you use method references, `thenComparing`, and `reversed` to sort `Album`s by `year` in DESCENDING order, sorting `Album`s within the same year by `artist` in ASCENDING order, followed by `title` in ASCENDING order?
