# Streams

Having learned about lambdas in [the previous lesson](../15_lambdas/), we will learn about a related construct in Java called **streams**.
Lambdas and streams are often used together.

Streams allow us to take a series of computations we mean to perform on a collection of data, and compose them into a "pipeline".

In this lesson, we'll start with concrete examples of using the Streams API, since on the surface there is very little new or unfamiliar happening here.
Following this, there is a brief discussion about what exactly is meant by "streaming", and some of the underlying properties of streams in Java that are important to know about.

## An example problem

Before we start, let's recall the **map** and **filter** patterns that we talked about in the previous lesson.

- In the **map** pattern, we define a function that describes a computation that we want to perform on each item in a collection. The **map** applies that function to each item in the list and returns a new list containing the results (i.e., the result of applying the function to each item in the original list).
- In the **filter** pattern, we define a predicate that describes a condition we want to check for each item in a collection. The **filter** tests each item against that condition, and returns a list containing the items that "pass" or "satisfy" the predicate.

Continuing with our examples of `Album` objects, let's suppose we have a list of `Album`s that we are working with.
For the purposes of this example, let's assume `Album` objects have the following fields:

- `String title`
- `String artist`
- `int year`
- `long unitsSold`
- `double price`

We are given the following problem prompt:

> Write a program that consumes a list of `Album` objects, and, for the `Album`s released after the year 2000, computes the average number of units they have sold.

Let's consider two solutions to this problem: one using regular `for-each` loops, like we are used to, and one using streams and lambdas.

### A `for-each` loop solution

As you read the code below, try to identify usage of the **map** or **filter** patterns.

```java
public static double averageSalesAfter2000(List<Album> albums) {
  long sum = 0;
  int albumsAfter2000 = 0;

  for (Album current : albums) {
    if (album.getYear() > 2000) {
      long sales = album.getSales();
      sum = sum + sales;
      albumsAfter2000 = albumsAfter2000 + 1;
    }
  }

  if (albumsAfter2000 > 0) {
    return sum / albumsAfter2000;
  } else {
    return 0;
  }
}
```

### A streams solution

The same problem can be solved using streams.
The code is below, and an explanation of each line follows.

```java
public static double averageSalesAfter2000(List<Album> albums) {
  OptionalDouble result =  albums.stream() // Stream<Album>
    .filter(a -> a.getYear() > 2000) // Stream<Album>
    .mapToLong(a -> a.getUnitsSold()) // LongStream
    .average(); // OptionalDouble

  // After filtering, there may not be any albums left.
  // In that case, we just return 0.
  return result.orElse(0);
}
```

In the code above, we have organised a series of computations into a _stream pipeline_.

- We first call `stream` on the list of albums, to turn it into a stream of albums (`Stream<Album>`). This step is necessary to be able to call the other stream operations.
- Then, we use `filter` to filter down to albums released after the year 2000. We define the condition as a lambda (a `Predicate`), passed as a parameter to `filter`.
- Then, we use `mapToLong` to go from a collection of `Album` objects to a collection of `Long` values. We could've used `map` here instead of `mapToLong`, but using `mapToLong` means that we get back a stream whose _static type_ is `LongStream`. This means we have access to a number of useful numerical operations, like `average`.
- The `LongStream` provides an `average` method, which we can use to compute the average of the items remaining in the stream. This gives us an `OptionalDouble` in return. `OptionalDouble` is a class in Java representing a `double` which may or may not exist.
  - The reason this double may not exist is that, if the list is empty after filtering, we can't compute an average, because you can't divide by 0.
- We get the computed average from the `OptionalDouble` object and return the value.
  - The `orElse` method on the `OptionalDouble` gets us the computed value if it exists, or it gives us a specified "backup" value otherwise.

## Common stream operations

The [Streams API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html) provides a whole host of operations that can performed on streams of data.

Here are some commonly used operations you'll want to know about.

### `filter`

The `filter` function is used to discard items that do not match a given condition.
It is called on a `Stream`, takes a `Predicate` as a parameter, and returns a `Stream`.
The `Predicate` is called on each item in the `Stream`, and only items for which the result is `true` are kept in the resulting `Stream`.

So for example, if you have a list of `Album` objects, and you want to only keep `Album`s that were released after the year 2000, you can achieve this using `filter` as follows:

```java
// Assuming "albums" is a List<Album>, populated with records
Stream<Album> filtered = albums.stream()
  .filter((album) -> album.getYear() > 2000);
```

### `map`

The `map` function is used to apply a function to each item in a collection, obtaining a result for each item.
It is called on a `Stream`, takes a `Function` as a parameter, and returns a `Stream`.
The resulting `Stream` contains the results of applying the function to each item in the original `Stream`.

For example, if you have a list of `Album` objects and you would like to compute, for each `Album`, its total sales (i.e., `unitsSold * price`), you could use `map` as follows:

```java
// Assuming "albums" is a List<Album>, populated with records
Stream<Double> totalSales = albums.stream()
  .map((album) -> album.getUnitsSold() * album.getPrice());
```

> **PONDER**
>
> Why do you suppose the data type of `totalSales` above is `Stream<Double>`?

### `reduce`

Finally, the `reduce` function is used to, well, *reduce* a list of data into a single value.
For example, finding the sum of a list of numbers and finding the minimum in a list of numbers are both examples of reduce operations.

The `reduce` function is called on a `Stream`, and takes a `BinaryOperator` as a parameter.
A `BinaryOperator` is a function that takes in two parameters of the same data type, and returns a value that also belongs to the same data type.

Let's call it the *accumulator* function.
The accumulator function has two parameters: the *result* so far and the *current* value.
The reduce operation starts by invoking the accumulator function on the first two items in the list.
The result of this operation is used in the next invocation of the accumulator, along with the *next* item in the list, and this continues until the list is exhausted, leaving you with a single final result.

Let's look at a relatively simple example: finding the sum of a list of numbers.

```java
List<Integer> numbers = List.of(2, 3, 10, 5);
Optional<Integer> optionalSum = numbers.stream()
  .reduce((result, current) -> result + current); // Optional in case the list was empty
```

In the example above, the accumulator function starts with the first two items in the list, `2` and `3` and gives the value `5` in return.
The value `5` is then used as the `result` parameter in the next usage of the accumulator, along with the number `10`, and we get the value `15`.
Finally, the value `15` is used as the `result` parameter and added to the number `5`, and we get the final answer `20`, which is the sum of the list of numbers.

In this way, the `reduce` operation *folds* the list in on itself, one value at a time, starting from the left.

| | | | | |
|- | - | -| - | - |
| The original list | 2 | 3 | 10 | 5 |
| Sum the first 2 numbers | | **5** | 10 | 5 |
| Add the next number to the running total | | | **15** | 5 |
| Add the next number to the running total | | | | **20** |

Notice that the return type of `reduce` is an `Optional` — this is because if the list was empty, no result would be produced.
To get the final `int` result, you would call `.get()` on the result, after making sure it `isPresent`.
Clunky, I know.

`reduce` has an overload in which you can specify an *initial value.*
In this case, instead of starting off your accumulator on the first two items in the list, you would start it on the initial value and the first item in the list.
It can be used as follows.

```java
List<Integer> numbers = List.of(2, 3, 10, 5);
int sum = numbers.stream()
  .reduce(0, (result, current) -> result + current);
```

In the example above, the initial result is `0`, and if the list had happened to be empty, the final answer would also be 0.

Reductions are extremely common list operations.
For example, if you want to check if _any_ item in a list meets a condition, the accumulator would use a Boolean OR.
To check if _all_ items meet a condition, the accumulator would use a Boolean AND.
Counting the number of items in a list is also use a reduction—the accumulator adds `1` for each item in the list.

Many of these operations have been provided as convenience functions in the [Stream API](https://docs.oracle.com/en/java/javase//21/docs/api/java.base/java/util/stream/Stream.html): see `anyMatch`, `allMatch`, and `count`, for example.

> **DISCUSS**
>
> Given a list of `Album` objects, how would you use `reduce` to find the `Album` with the highest `unitsSold`?

## Streams are not data structures

**A stream, by itself, does not store data, and is technically not a data structure.**
Streams are wrappers around a data source.
They allow us to define a series of operations that should be performed on that data source, and they make bulk processing of data convenient and fast.

The "data source" for a stream can be anything—an array or list, a file stored on disk, a stream of data coming from some external service, etc.
In this class, we will only deal with streams based on lists or arrays, but this section describes how Streams might be used to work with other types of data sources.

**A stream never modifies its underlying data source.**
For example, you cannot use stream operations on a list to remove items from or add items to the list.
Just like you can't add or remove items from a list while looping over it using a `for-each` loop.

**A stream pipeline usually consists of 3 pieces**:

- **A data source**, which can be an array, a list, a file, etc.
- **Zero or more intermediate operations**, each of which transforms the stream into another stream. Because these intermediate operations return streams themselves, they can be chained together to perform a number of operations.
- **Exactly one terminal operation**, which produces a result or a side effect. Since the terminal operation "exits" the pipeline, no further stream operations can be added to the pipeline. That is, the terminal operation is always the last operation in a stream pipeline.

In our example above,
- `albums` was the **source** of the stream
- `filter` and `mapToLong` were **intermediate operations**
- `average` was a **terminal operation**

**Stream pipelines are lazy.**
A stream pipeline will not begin executing until it has to.
Specifically, the stream processing won't be "kicked off" until a terminal operation is called.

For example, if we had only called `filter` and `mapToLong` above, we would still be left with a `LongStream`, i.e., a stream of longs.
No processing would take place unless some terminal operation was added to the pipeline.

Some examples of terminal operations are:

- Collecting the result of the stream pipeline into a list (`.toList()`).

```java
List<Double> albumCosts = albums.stream()
  .filter(a -> a.getYear() > 2000)
  .map(a -> a.getPrice())
  .toList();
```

- Counting the elements left in the stream after the intermediate operations have been performed (`count()`)

```java
int albumsBefore2000 = albums.stream()
  .filter(a -> getYear() < 2000)
  .count();
```

- Looping over the elements in the stream and operating on them, i.e., applying a `Consumer` to each item (`.forEach(Consumer)`)

```java
// Reduce cost of pre-2000 albums by 10%
albums.stream()
  .filter(a -> a.Year() < 2000)
  .forEach(a -> a.setPrice(a.getPrice() * 0.9));
```

- Finally, as we've seen above, you can perform numerical aggregations (like `.sum()` or `.average()`) when you have primitive streams like `IntStream`, `DoubleStream`, `LongStream`.

## What is "streaming"?

You likely already know the meaning of the word "streaming".
For example, you've heard of "streaming music" or "streaming a video" over the internet.
To simplify it greatly, it means to _process data while it loads_, rather than to load all the data before beginning to process it.

For example, when you're streaming a movie on Netflix, you're not actually downloading the whole movie to your machine and then watching it.
Rather, chunks of the movie are being sent to your computer and played in your browser as they arrive.

`Stream`s in Java are a similar idea.

This can be a useful mode of operation when you are working with huge amounts of data that cannot all be loaded into memory at once, or if you are working with "never-ending data", for example, minute-by-minute readings from weather sensors.
In these situations, you cannot wait to load all the data into, say, an `ArrayList` before you begin processing the data.

Consider the following scenario.
Let's imagine you need to read and process data from a HUGE file on your hard disk: `MyGiantFile.txt`
The file is too large for you read the entire thing into a list of strings.

One way you could do this is to use a `Scanner` to read the file and process it line by line, like we have done in a project and a couple of labs this term.

```java
Scanner scanner = new Scanner(new File("MyGiantFile.txt"));
while (scanner.hasNext()) {
  String line = scanner.nextLine();

  // Assume we do some work with the line here
}
```

With the streams API, we can now concisely define operations like the above using lambdas and all the benefits they bring.

The `Files.lines` static method creates a stream of strings, allowing us to define a pipeline of operations that will apply to each line in `MyGiantFile.txt`.

```java
Files.lines(Path.of("MyGiantFile.txt"))
  .map(line -> .....)
  .filter(line -> ........)
  .forEach(line -> .......);
```

Because `Files.lines` returns a `Stream<String>`, the lines in the file and _streamed_ through our pipeline, but this detail is abstracted away from you, the developer.

If you use a simple collection in memory (like an array or list) as the source of a stream, you're not gaining much in the way of "streaming" — in that situation, the Streams API mostly provides a convenient library and syntax for performing operations on a collection data. Still pretty good!
