# `Comparable`

> The [`Comparable` interface](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Comparable.html) is used when we create a class and we want to define a "natural" ordering between any pair of objects created from that class.
> In essence, its job is to let us define `>`, `<`, and `==` relationships for classes that we create.

The `Comparable` interface contains a single abstract method that must be implemented by implementing subclasses:

`int compareTo(T other)`

It defines how `this` object compares to the `other` object.

Two things are worth discussing about the method signature.

1. **The parameter `T other`:** The `T` here is a placeholder type. The `Comparable` interface doesn't know what type of data is going to be compared, and doesn't care. In our `Album` class, the signature would be `int compareTo(Album other)`.
2. **The `int` return type.** The comparison is not a binary decision: there are three possible outcomes (`<`, `>`, or `==`). So we cannot use a `boolean` as the return type.

The "contract" for the `compareTo` function is:

- If `this` is "less than" `other`, i.e., it should come before `other` in a sorted list, return a negative number.
- If `this` is "greater than" `other`, i.e., should come after `other` in a sorted list, return a positive number.
- If `this` and `other` are equal, return `0`. In general, it's recommended that if `this.equals(other)` is `true`, then `this.compareTo(other)` should return `0`.

Consider the code below.
We have an `Album` class that is declared to be `Comparable`.
We are saying `Album` objects are comparable to other `Album` objects.
This means the `Album` must define a `compareTo` method.

In the example below, we are saying that `Album` ordering is determined based on their `title`s.
Notice that we are not ourselves writing a lexicographic comparison of `this.title` and `other.title`: `title` is a `String`, which itself implements the `Comparable` interface.
We can use that.

```java
public class Album implements Comparable<Album> {
  private final String title;
  private final String artist;
  private final int year;
  private double price;

  // ... Assume we have written a constructor, getters, setters etc.

  @Override
  public int compareTo(Album other) {
    return this.title.compareTo(other.title);
  }
}
```

### What does this get us?

Consider our `sort` function example from above.
If, instead of using `Album[]` as our parameter type, we used a `Comparable[]` as our parameter type, we can now use the same `sort` function for _any_ data type, as long as that data type implements the `Comparable` interface.

See the `if` statement in the updated `sort` function below.

```java
public static void sort(Comparable[] arr) {
  for (int i = 1; i < arr.length; i++) {
    for (int j = i; j > 0; j--) {
      if (arr[j].compareTo(arr[j - 1]) < 0) { // If arr[j] is "less than" arr[j - 1]
        // Swap arr[j] and arr[j-1]
        Album temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
      } else {
        break;
      }
    }
  }
}
```

This is an example of using *abstraction* — we are ignoring or abstracting away the details of the specific object being sorted, and only focusing on the salient detail, i.e., the fact that it can be compared to other objects of its own type.
Because we can use `compareTo`, we don't need to know or care what specific type of object is stored in `arr`.

And this is exactly what is done in sort functions already available in the Java standard library.
The `Collections` class provides a number of helpful static functions; among them is `Collections.sort`.

If you have a list of objects, and those objects are `Comparable`, you can call `Collections.sort` on that list to sort it according to the object's "natural ordering", i.e., according to its `compareTo` method.

Note that `Collections.sort` sorts the list _in place_, meaning it mutates the underlying list, instead of returning a new sorted list.

```java
List<Album> albums = Arrays.asList(
  new Album("Rubber Soul", "The Beatles", 1965, 18.99),
  new Album("1989 (Taylor's Version)", "Taylor Swift", 2023, 18.99),
  new Album("1989", "Taylor Swift", 2014, 18.99),
  new Album("Leaving Eden", "The Carolina Chocolate Drops", 2012, 18.99)
);

// If Album does not implement Comparable, this line won't compile.
Collections.sort(albums);

for (Album current : albums) {
  System.out.println(current);
}
```

The code above would print:

```txt
1989
1989 (Taylor's Version)
Leaving Eden
Rubber Soul
```

> **PONDER**
>
> Suppose you were asked to handle tie-breakers. E.g., for albums with the same title, break ties by artist name.
> How would you handle this in the `compareTo` function?

> **PONDER**
>
> Can you change `Album`'s `compareTo` to induce a reversed ordering, i.e., in descending order?


## `Comparator`

The `ComparABLE` interface is used to define a "natural ordering" for an object.
What exactly does that mean?

You should use `Comparable` when there is an argument to made that there is an _obvious_ way to compare two objects of a given type.
For example, the `String` class in Java implements the `Comparable` interface.
It defines what many would _naturally_ expect when they compare two `String` objects, say, for the purpose of sorting.
It compares `String`s using their lexicographic ordering, i.e., their alphabetic order.

However, sometimes you need to order a collection of objects using something other than its natural order.
Or you need to order a collection of objects that cannot be reasonably considered to have a "natural" ordering for all circumstances.
These are cases in which you need to define, on an as-needed basis, a custom comparison between two objects.

That's where the `ComparATOR` interface comes in.
These two interfaces are annoyingly similarly named, I know.

### Example

So, for example, suppose we need to compare albums by their `price`, and not by their "natural" ordering based on `title`.

The `Comparator` interface defines one abstract method that must be implemented by subclasses:

```java
public int compare(T o1, T o2)
```

This is very similar to the `compareTo` method for the `Comparable`. The only difference is now we take two parameters instead of one, because _both_ items to be compared are being passed to the method.
That is, the "calling object" is not the one being compared, so `this` is not really relevant here.

To compare `Album`s by `price`, we would create a new class that implements the `Comparator` interface, and implement the required `compare` function in that class.

```java
public class AlbumPriceComparator implements Comparator<Album> {
  public int compare(Album o1, Album o2) {
    if (o1.getPrice() > o2.getPrice()) {
      return 1; // Can return any positive integer
    } else if (o1.getPrice() < o2.getPrice()) {
      return -1; // Can return any negative integer
    } else {
      return 0;
    }
  }
}
```

This comparator object can then be used to impose "custom" orderings on `Album`s.

**How does this help us?** The `Collections.sort` function has an overloaded version that takes two parameters:

- A collection of objects
- A comparator to use for pairwise comparisons

If you use this version of the `Collections.sort` function, you _don't_ need the objects being sorted to be `ComparABLE`. This is because the second parameter, the `ComparATOR`, knows how to compare those objects.

```java
List<Album> albums = ...; // Same list as before
Comparator<Album> priceComp = new AlbumPriceComparator();

// Sort the albums in ascending order of price
// Doesn't matter here whether or not Album implements Comparable
Collections.sort(albums, priceComp);
```

## In the next lesson...

**We can also dynamically create `Comparator`s on an as-needed basis.**
Comparators are useful when you don't know upfront how a collection of objects is going to be compared or sorted.

Continuing with the Album example, consider your music library in whatever application you use to manage and listen to your music.
Chances are you've seen a "table view" that lists all the songs in your library, and you can click on the columns in that table to change how the songs are sorted.
E.g., if you click on "Title" the songs will be sorted by title. If you click on "Artist" the order will change. If you click again, it'll reverse it.

These are _dynamic_ changes in the current sort order, i.e., they are happening while the program (the application, Spotify or whatever) is running.
Can we programmatically spin up new `Comparator`s to support these changes in desired sort orders?

**Doesn't this seem like a lot of work to just write one `compare` function?**
All we really care about is that `compare` function, but because we need to "pass" the `compare` function to the `sort` function, we went through the rigmarole of wrapping it in a class and creating an object.

In the next lesson, we'll learn about using *lambdas* in Java to concisely create new `Comparator`s.
Lambdas allow us to treat functions as *values* that can be stored and passed around, e.g., as parameters to other functions.
We'll use that as a springboard to learn about lambdas and functional programming more generally.
