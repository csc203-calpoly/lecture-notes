# Comparables and Comparators

> In this lesson, we're going to learn about the `Comparable` and `Comparator` interfaces in Java.
> These interfaces help us to, well, *compare* pairs of objects to determine and order between them.

**Let's start with a motivating example.** Let's consider the problem of *sorting a list of objects.*

You've probably studied a number of sorting algorithms like [insertion sort](https://en.wikipedia.org/wiki/Insertion_sort), [merge sort](https://en.wikipedia.org/wiki/Merge_sort), [quicksort](https://en.wikipedia.org/wiki/Quicksort), etc.
They all work slightly differently, but ultimately the outcome is the same: given a collection of data, they each give you back that same collection with the items arranged *in order.*

> The **"in order"** in the sentence above is actually doing a lot of work.

Every sort function needs to, at some point, do a *pairwise comparison* of objects in the collection that's being sorted.
That is, regardless of how the sorting algorithm works, at some point two items in the collection need to be compared to each other to determine how they should be ordered relative to each other.

Consider the following `sort` function that implements [insertion sort](https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/InsertionSort.html).[^opendsa]
How we perform that pairwise comparison is going to depend on _what_ is being sorted.

[^opendsa]: From the [OpenDSA chapter on Insertion Sort](https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/InsertionSort.html).

```java
public static void sort(Album[] arr) {
  for (int i = 1; i < arr.length; i++) {
    for (int j = i; j > 0; j--) {
      if (______________________) { // Compare arr[j] and arr[j - 1]
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

The blank in the `if` statement in the code above is where the comparison should take place.
That is, we need to check if `arr[j]` is "less than" `arr[j - 1]`, whatever that means for the particular data being sorted.

**How should that comparison take place?**

When we think about sorting a list of numbers, the comparison is clear: we often mean to order the numbers in ascending order, i.e., smallest-to-largest.
That is, for any pair of numbers, we know the smaller one should come before the larger one.
If we needed to order them in descending order (largest-to-smallest), that's still easy---given the numbers `8` and `5`, we can easily say what their relative order should be using operators like `>`, `<`, and `==`.

<!-- Suppose, instead, you have a list of strings.
Slightly more complicated, but again, our intent is likely predictable: we mean to sort the list in alphabetical order. -->

Suppose, instead, you have a custom object, based on a class you have just created.
For example, an `Album` object that contains a number of fields (or instance variables):

- `String title`
- `String artist`
- `int year`
- `double price`

How should a list of `Album`s be sorted? By `title`, `artist`, `year`? Some combination of fields?
We cannot use comparison operators like `>` or `<` on our `Album` object because those operators are reserved for numerical (and `char`) types in Java.

At the same time, we don't want to have to re-write our `sort` function for our `Album` class, because pretty soon we will have an `Artist` class and then a `Song` class, and we definitely don't want to keep re-writing a sorting algorithm when the only thing that's changing is the _type of data_ that's being sorted (and therefore, the pairwise comparison).

So, how should we compare `Album`s? We can write custom code to compare any two `Album`s using whatever criterion we think is a good "natural ordering" for `Album`s.

Observe that, no matter how we decide to order `Album`s, the rest of that `sort` function will stay the same.
The _only_ part of the function that needs to change is the comparison in the `if` statement.

Can we abstract out that comparison so that the `sort` doesn't need to know how it's being done?
