# Lambdas

In the previous lesson, we learned about expressing `Comparator`s more concisely using the lambda syntax.
This is possible because `Comparator` is a _functional interface_.

> A functional interface is an interface in Java with exactly one abstract method.

Because `Comparator` only has one abstract method (`compare`), we can concisely initialise `Comparator`s like so:

```java
Comparator<Album> comp = (a1, a2) -> a1.getTitle.compareTo(a2.getTitle());
```

The lambda above defines a function, and because there is only one abstract method in `Comparator`, there is no ambiguity about what that function is.
It's the `compare` function!
This means the compiler is able to infer things like the parameter types of `a1` and `a2`, and check that the function returns an `int` as is required by the `compare` function.

There are a whole bunch of other lambdas available in Java — too many to describe here!
So in this lesson, we'll focus our discussion on three useful types of lambdas available in Java:

- `Function<T, R>`: This is the most generally-useful type of lambda. It represents a function that takes in one input and produces an output. The `T` is a placeholder for the input type, and the `R` is a placeholder for the result type.
- `Predicate<T>`: A predicate is essentially a function that returns a boolean. The `T` is a placeholder for the input type. There is no placeholder for the output type because the output is a `Boolean`.
- `Consumer<T>`: A consumer is an operation that takes in a single input and returns no result. Sort of like a lambda version of a `void` method. The `T` is a placeholder for the input type. There is no placeholder for the output type because there _is_ no output.

All of the above are _functional interfaces_, meaning they are all interfaces that contain exactly one abstract method each.
The three functional interfaces above are rather more generally useful than the `Comparator` interface.
While the `Comparator` interface defines a function for a very specific purpose (taking in two objects and returning an `int` based on their comparison), the lambdas above can be used in a wide variety of problems.

Let's talk about them.

## Function

A `Function` is exactly what you think it is: it's a procedure that takes in some input value and produces some output.

When you use a `Function`, you must also declare its input and output types.
Here are several examples of `Function`s written as lambdas:

**A function that takes in a number and returns its square:**

This function is expected to take in an integer as its input and return an integer as output.
Therefore, we declare the function using `Function<Integer, Integer>`.

```java
Function<Integer, Integer> square = num -> num * num;
```

Because the function above takes a single parameter, we can omit the parentheses around the parameter `num`.
We also don't need to specify the type of `num`, because we've already declared that the function is a `Function<Integer, Integer>`, i.e., its input type is an `Integer` and its output type is `Integer`.

**A function that takes in a String and returns its length:**

This function is expected to take in a string and return an integer.
So we declare it using `Function<String, Integer>`.

```java
Function<String, Integer> stringLength = s -> s.length();
```

> **PONDER**
>
> The above function is using a lambda only to call an existing method on the input. This is the exact use case for using method references. How would you re-write the above function using a method reference? **Try to answer this yourself before expanding the answer below.**

<details>
<summary>Click to see answer</summary>

```java
Function<String, Integer> stringLength = String::length;
```

</details>

**A function that takes in an Album and returns a String describing it:** (e.g., `"Rubber Soul by The Beatles"`)

```java
Function<Album, String> stringDesc = a -> a.getTitle() + " by " + a.getArtist();
```

**The `Function` interface has one abstract method: the `apply` method.**
The method takes in one parameter and returns one value.
The types for the parameter and the returned value are decided when the `Function` is first created, as you can see in the examples above.
This `apply` method is what you are defining when you write a lambda.

### A motivating example

A common task in programming problems is to apply some operation to all the items in a list, and produce a list of results.
This is commonly referred to as a **map** operation, i.e., you are _mapping_ some input value to some output value.
You will be surprised at how often this pattern appears in your programs.

In a **map** operation:

* The **input** is a list of some type (e.g., `List<T>`).
* The **output** is a list of some type (e.g., `List<R>`), where `R` can be the same as or different from `T`.
* The input and output lists are the same length, because the output is obtained by applying a function to each item in the input.

For example, suppose you are a teacher and your students have just taken an exam.

Suppose you realise that the class as a whole performed poorly on a particular question that was not clearly worded.
As a result, you need to add 2 points to everyone's exam scores.

First, let's acknowledge that you could easily write this using a `for` loop.

```java
public static List<Integer> mapToAdjustedScores(List<Integer> examScores) {
  List<Integer> result = new ArrayList<>();

  for (int current : examScores) {
    int adjusted = current + 2; // This is the "map" operation
    result.add(percent);
  }

  return result;
}
```

As another example, the maximum possible score is 44 points, so your students have scores like `42`, `44`, `40`, `39`, etc.
You would like to turn all of these scores into percentages, i.e., by dividing each of them by `44` and multiplying by `100`.

Again, easily doable using a `for` loop.

```java
public static List<Double> mapToPercentages(List<Integer> examScores) {
  List<Double> result = new ArrayList<>();

  for (int current : examScores) {
    double percent = ((double) current / 44) * 100; // This is the "map" operation
    result.add(percent);
  }

  return result;
}
```

Observe that _the two functions are nearly identical_, except for one thing: they differ in the operation performed on each list item within the for loop (and consequently, the data type of the resulting lists).
This is because both functions are versions of the **map** pattern in action. Can we abstract out the common parts so that only the differing parts (the insides of the for loops) need to be specified each time?

In other words, can we *parameterise* the map operation so that the nearly-identical functions don't need to be written multiple times?

### Parameterising our mapper

Instead of the two functions above, consider the following generalised `map` function.
We can take in a function as a parameter to this function, allowing this `map` function to be more generally useful.

There is some new notation in this code, which I will explain below.
Please take some time to read the code and its accompanying comments.

```java
// T and R are declared as "type parameters"
public static <T, R> List<R> map(List<T> inputList, Function<T, R> func) {
  // The type of this list should match the output type of the Function parameter
  List<R> outputList = new ArrayList<>();

  // The type in this for loop should match the type of the input list
  for (T current : inputList) {

    // Recall that "apply" is the name of the abstract method in the Function interface.
    // We call "func" on the current item and save the result in a variable.
    R result = func.apply(current);

    // Store the result in the output list.
    outputList.add(result);
  }

  return outputList;
}
```

Some key things to note about the code above:

- **`<T, R>`** — `T` and `R` are **type parameters** in this function. We don't yet know what those types will be, so for now we declare them as parameters, similar to how `inputList` and `func` are "value parameters".[^generics]
- **`Function<T, R> func`** — Notice this `Function`'s input and output types. The input type, `T`, matches the type of each item in the `inputList`. The output type, `R`, matches the type of each item in the returned list, i.e., `List<R>`. At this point we don't know what the actual types for `T` and `R` are.
- **`func.apply(current)`** — Inside the `for` loop, we apply or call our mapper function on each item in the input list. Remember that at the end of the day `Function` is just an interface. It contains a single abstract method called `apply`. In this line, we call that `apply` function, giving it the current item in the list as an input.
  - Because we've declared the output type of our function to be `R`, we can use `R` as the data type when we store the result in a variable.

[^generics]: This is an example of using **Java generics**. Generics allow you to declare _type parameters_, i.e, you can use placeholder names for data types, with the understanding that the placeholder will be replaced with an actual type when the code is invoked. This is identical to how you use "normal" parameters for methods and functions: you declare a variable name in the method signature, and when you call the function, that's when the variable actually gets a value.

#### Usage examples

We can now use our `map` function to accomplish both tasks above, by only writing the code that does the mapping, and not having to re-write the rest of the function each time.
We can express those operations as lambdas, given as parameters to our `map` function.

```java
List<Integer> scores = List.of(42, 39, 43, 44, 40, 37, 35);

// Bump all scores by 2 using our map function
List<Integer> bumpedScores = map(scores, s -> s + 2);
```

When we call `map` in the code above, the type parameters `T` and `R` are now resolved to actual types. `T` is now `Integer`, because the input list is a list of integers, and `R` is also `Integer` in this case, because our lambda's return type is integer.

We can also turn all scores into percentages.

```java
// Turn scores into percentages
List<Double> percentages = map(scores, s -> ((double) s / 44) * 100);
```

In the call above, `T` is `Integer`, and `R` is `Double`.

The **map pattern** is an extremely common programming pattern.
Virtually every mainstream programming language provides `map` as an operation that can be performed on collections of objects, and Java is no exception.
We will see how to use this in the next lesson on Streams.

For now, let's continue talking about different types of lambdas available in Java, and move on to the `Predicate`.

## Predicate

A `Predicate` is a function that returns a Boolean value.
Unlike a `Function`, you only need to specify an input type for a `Predicate`, because the output type is always `Boolean`.

Here are several examples of `Predicate`s written as lambdas.

**A predicate that takes in an integer and check if it is even.**

```java
Predicate<Integer> isEven = num -> num % 2 == 0;
```

**A predicate that takes in an Album and checks if it was released in this millenium.**

```java
Predicate<Album> inThisMillenium = album -> album.getYear() > 2000;
```

> Both of the above can also be declared as `Function`s, i.e., as `Function<Integer, Boolean>` and `Function<Album, Boolean>`. The `Predicate` exists as a useful abstraction because creating boolean functions is a common use case in programming, as we will see. **`Predicate`s are, in essence, a way to parameterise boolean conditions.**

The `Predicate` interface has one abstract method: the `test` method.
The `test` method takes in one input and returns a `boolean`.
That `test` method is what you are implementing when you express a `Predicate` as a lambda.

### A motivating example

Another common task in programming problems is to **filter** a collection of items based on some condition.
Like `map`, `filter` is an extremely common sub-step in solving programming problems.

In a **filter** operation:

* The **input** is a list of some type (e.g., `List<T>`).
* The **output** is a list of the *same* type (`List<T>`).
* The output is a subset of the input, because the output is obtained by filtering the input based on some condition.

For example, continuing with the teacher example above, let's say you want to find out which students scored below a 70% on the exam (i.e., scores that are less than 31).
The first thing you need to do is filter out the scores that are greater than 31.

We could do this easily using a for loop.

```java
public static List<Integer> filterLessThan70(List<Integer> scores) {
  List<Integer> result = new ArrayList<>();

  for (int current : scores) {
    if (current < (0.7 * 44)) { // This is the filter condition
      result.add(current);
    }
  }

  return result;
}
```

### Parameterising our filter

Like we did with the `map` function we can make our `filter` more generally usable by parameterising the condition on which the list is filtered.

Consider the code below. We have re-written our `filter` function to only include the common elements of a typical `filter` operation, and parameterised things that might change from one instance to another.
For example, we have parameterised the data type of the input and output lists, and we have parameterised the predicate used to test whether a given item should be kept or filtered out.

```java
// T is declared as a "type parameter". We don't need to declare an output
// type because it is the same as the input type.
public static <T> List<T> filter(List<T> inputList, Predicate<T> pred) {
  List<T> outputList = new ArrayList<>();

  for (T current : inputList) {
    if (pred.test(current)) { // Use predicate to check the condition
      // If the predicate passes, save the current item
      outputList.add(current);
    }
  }

  return outputList;
}
```

In the code above, we use the `Predicate`'s `test` method to invoke the boolean function. If the `test` passes (i.e., it returns `true`), we save that list item to be returned in the output list.

#### Usage examples

We can use our `filter` function to accomplish filter tasks like the example above.

```java
List<Integer> scores = List.of(42, 39, 43, 44, 40, 37, 35);

// Filter down to scores less than 70% of 44
List<Integer> lessThan70Percent = filter(scores, s -> s < (0.7 * 44));

// Filter down to "A" scores (e.g., greater than 90%)
List<Integer> aScores = filter(scores, s -> s > (0.9 * 44));
```

The **filter** pattern is also an extremely common programming pattern, available "ready to use" on collections of data in most programming languages.

## Consumer

Finally, we will talk about the `Consumer`.
The `Consumer` is a functional interface used to define operations that have no outputs.

It defines one abstract method: `accept`. The method takes in one input and returns nothing, i.e., its return type is `void`.

Here are several examples of consumers:

**A consumer that takes in an album and cuts their prices by 10% (heck yeah, sale!).**

```java
Consumer<Album> discount = album -> album.setPrice(album.getPrice() * 0.9);
```

**A consumer that takes in a Student and increases the number of units they have completed by 12.**

```java
Consumer<Student> increaseUnits = student -> student.setUnits(student.getUnits() + 12);
```

### A motivating example

Just like `map` and `filter` are patterns for performing different types of operations on lists of data, a third pattern is also extremely common in programming.
And you're already familiar with this!

Consider the `for-each` loop — it loops over a collection of data, and performs some operation on each item in the list.

We could also write a `forEach` function that accomplishes this.

```java
public static <T> void forEach(List<T> inputList, Consumer<T> consumer) {
  for (T current : inputList) {
    consumer.accept(current);
  }
}
```

We now have a function version of the `for-each` loop!

## Other functional interfaces

The [`java.util.function` package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html) lists a number of functional interfaces, of which we have learned about 3 so far.

A key limiting factor in the `Function`, `Predicate`, and `Consumer` is that all of those lambdas can only take a single input.
We often need to write functions (or lambdas) that operate on multiple parameters.

The `Comparator` interface comes to mind — its `compare` function takes in two objects, the two objects being compared.

Among the other functions available in `java.util.function` are:

- `BiFunction<T, U, R>` — A function that accepts two arguments and produces a result.
- `BiPredicate<T, U>` — A function that accepts two arguments and produces a boolean (or a predicate that accepts two arguments).
- `BiConsumer<T, U>` — An operation that accepts two input arguments and returns no result.
- `BinaryOperator<T>` — An operation upon two operands of the same type, producing a result of the same type as the operands. For example, arithmetic expressions like plus or minus, or boolean expressions like **and** and **or** are examples of binary operators.

In many ways, the exact names of all the functional interfaces isn't what's most important.
In the next lesson, we will learn about _streams_, which allow us to express a series of operations to be performed on lists of data by chaining together calls to functions like `map`, `filter`, and `forEach`.
In these cases, lambdas are written inline as arguments to those functions themselves, and you rarely have to declare that a lambda is a `Function`, `BiFunction`, `Predicate`, etc.

For example, if you had a list of exam scores, and you wanted to:

- turn each score into a percentage
- bump up each percentage by 5
- round each percentage to the nearest whole number
- filter down to the "A" scores

You _could_ do all of that in a for loop, or you could use lambdas and streams. Here's a sneak peak:

```java
List<Integer> scores = List.of(42, 39, 43, 44, 40, 37, 35);

List<Double> scoresUpdated = scores.stream()
                                   .map(s -> ((double) s / 44) * 100) // percentages
                                   .map(s -> s + 5) // bump up
                                   .map(Math::round) // round the scores.
                                   .filter(s -> s >= 90) // filter to "A" scores
                                   .toList(); // get the final result list back
```
