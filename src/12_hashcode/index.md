# `hashCode`

> This brief lesson is about the `hashCode` function in the `Object` class.
> * Like `toString` and `equals`, all classes inherit (or can override) the `Object`'s `hashCode` function.
> * Like `toString` and `equals`, you should write a `hashCode` for new classes that you create.

The purpose of the `hashCode` function is to generate an as-far-as-possible unique integer for distinct objects.
The produced integer should be consistent for the object.
That is, the produced integer should not change unless the object itself is changed in some way.

## What's `hashCode` used for?

Think about the `HashMap` data structure, discussed [in a previous lesson](../03-lists-maps-existing-classes/).
The `HashMap` supports these fundamental operations:

- `put` entries (key-value pairs) into the map
- `get` values from the map quickly, using a key

The operations above can, for the most part, be done in constant time.
This is possible because of the "hash" part of the data structure.

Suppose you are trying to use a given key `k` to put some value `v` into the map.
The `HashMap` uses the key's `hashCode` value to "find a place" for `v`.
That is, you can imagine that it calls `k.hashCode()` to produce some unique integer, and uses that integer to choose a position in which to store `v`.

The same thing is done when we try to retrieve `v` from the map, using the key `k`.
That is, the map will call `k.hashCode()` again, come up with the _same integer_ as before, and find the value `v`.
If done well, this can happen without searching the entire set of entries — so no matter how many records are in the map, we do the same amount of work to look up a value using its key.

### A `hashCode` is an integer

The `hashCode` function has the following signature in the `Object` class:

`public int hashCode()`

So any override in a class you create must also have the same signature, otherwise it will not actually override the `hashCode` function, and won't be used by data structures like the `HashMap` or `HashSet`.

Ok, fine, it's a method that returns an `int`. That's easy enough! But you can't return any old integer. It's important to, as far as possible, return a _unique_ integer for any given object, and to have that integer be consistent across multiple calls to `hashCode` unless the object changes.

When distinct objects have distinct `hashCode`s, this ensures that the objects are appropriately "spread out" in a map or set.
On the other hand, if many distinct keys produce the same `hashCode`, then those keys would "collide" in the map or set.
Maps and sets are able to handle these collisions (e.g., a simple way is to "stack up" all the keys that have the same `hashCode`).
But the more collisions you have, the more your map's performance degrades.
That is, if many collisions occur, then the bigger your map gets, the more time it takes to add to retrieve items from it.

> Having distinct hash codes for distinct objects ensures that the performance of the `get`, `put`, and `contains` operations for maps and sets remain as close to constant time as possible.

### `equals` and `hashCode` go hand-in-hand

The `equals` and `hashCode` methods _must_ go hand-in-hand.

When you try to `get` an item from a map using a key, the following steps take place (a simplified overview):

1. Use the key's `hashCode` to "find" the data in the map.
2. When you reach the computed position, check if the provided key `equals` the key in the map entry.
3. If the two keys are `equal`, return the value from the map entry.
4. If the two keys are _not_ `equal`, follow the map's collision resolution policy to check the next possible location, or return `null`.

**This suggests that `hashCode` and `equals` should always take the same information into account, and should always "agree" with each other.**
Not doing this will result in strange and incorrect behaviour in your `HashMap`s and `HashSet`s.

These leads us to the following "contract" for the `hashCode` and `equals` methods in any class[^javadoc]:

- When `hashCode` is called more than once on the same object, it should consistently return the same integer, provided that no fields that are used in the `equals` method have been modified.
- If two objects are "equal" according to the `equals` method, then calling `hashCode` on them _must_ produce the same integer.
- If two objects are _not_ "equal" according to the `equals` method, it's difficult to guarantee that they return distinct integer results. But doing this as far as possible will improve `HashMap` and `HashSet` performance.

## Writing a `hashCode` function

So, how to write a good `hashCode`?
That's...out of scope for this class, and is an important research problem in its own right.
The [OpenDSA Chapter on Hashing](https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/HashIntro.html) is a really good overview.

In this example, we'll look at two examples of `hashCode` functions.

Suppose we have a simple `Person` class (the same one we used in [the previous lesson](../11_inheritance_equality/)). Each `Person` has two properties:

- `int age`
- `String name`

And two `Person`s are considered `equal` to each other if they have equal names and ages.
This means that:

1. Two `Person`s with equal names and ages should produce the same hash code.
2. If two `Person`s differ in name or age or both, they should produce different hash codes, as far as possible.

We'll look at two ways of writing the `hashCode` function.

### Rolling our own

One option is to compute an integer ourselves.
We should make use of all instance variables that factor into the `equals` decision in order to meet the "contract" we talked about earlier, and we need to make it so that differences in the values of those instance variables will result in differences in our final integer.

Here's an example.

- In the code below, we start with the number `1`.
- Then we multiply by `37` — multiplying by a prime number like `37` makes it more likely for us to produce a number that other objects _won't_ produce. You can use any prime number you want.
- Then we add the `name`'s `hashCode` value. The `String` class already has a `hashCode` function, so we don't need to re-invent that. Note that we are assuming here that the `name` is not `null`! We can do this because we [included code to guarantee this in the previous lesson](../11-inheritance-equality#equals) If it's possible for `name` to be `null`, then you need to check that first.
- We multiply this result again by `37`, then add the `age`.

```java
@Override
public int hashCode() {
  int result = 1;

  result = result * 37 + this.name.hashCode();
  result = result * 37 + this.age;

  return result;
}
```

### Using existing methods

A lot has been said or written about generating good hash values for different primitive data types (which in turn can be used as building blocks for generating hash values for reference types).
Many of these ideas have been implemented already.
In many cases it's better to use existing implementations instead of re-inventing the wheel.

The [`Objects`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html)[^s] class in Java contains number of useful static methods, among them utilities for generating a hash code based on a given set of fields.

[^s]: Notice the "s" in `Objects`.

The [`hash`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html#hash(java.lang.Object...)) static function takes in a list of parameters, and generates a hash code based on those values.
So we could rewrite the `hashCode` for our `Person` class as:

```java
@Override
public int hashCode() {
  return Objects.hash(this.name, this.age);
}
```

The `Objects` class also provides the [`Objects.equals`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html#equals(java.lang.Object,java.lang.Object)) function. You can use `Objects.equals(a, b)` instead of `a.equals(b)`.
This is useful in cases you are not sure if `a` is null or not — `a.equals(b)` would crash with a `NullPointerException` if `a` was null, whereas `Objects.equals` checks that for you, or you could check it yourself.

[^javadoc]: Paraphrased from the [Object documentation](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#hashCode()).
