# Method dispatch (overloading and overriding)

> Java has a number of mechanisms in which, when a program calls a method on an object, either the compiler or the runtime must decide *which* method should be executed for that method invocation.
> This is known as _method dispatch_.

## Method overloading (static dispatch)

***Method overloading*** allows us to perform the same task (call the same function) in multiple different ways, depending on the inputs that are given (the arguments that are given to the function).

More concretely, it allows the same class to define several methods that have the *same name* but different *parameter* lists.
In Java, a method's *signature* is its *name*, its *parameter list*, and any modifiers applied to it, like `public` or `static`.
Those first two pieces—the method name and parameter list—together uniquely identify a method within a class.
Within the same class, there can never be more than one method with a given name and parameter list.

However, we *can* have several methods with the same name, but different parameter lists.

How our program chooses between all of those methods with the same names is a matter of **static** or **dynamic dispatch**.

Consider the two classes in the example below: `Circle` and `Reporter`.

<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Circle.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Circle.html" width="100%" height="500px"></object>
</div>
</p>


<p>
<div style="width: 100%; margin: auto;">
  <small>
    <a href="Reporter.html" target="_blank">
      View in new tab
    </a>
    &nbsp;and then click <b>Walkthrough</b>.
  </small>
  <br/>
  <object data="Reporter.html" width="100%" height="500px"></object>
</div>
</p>


The `Reporter` class above contains three `static` methods called `report`.[^why-static]
Each one takes a different list of parameter types.

When we write code to call one of the methods, our toolchain needs to decide *which* method should get called.
This process is called *method dispatch*.

> **PONDER**
>
> Why do you think they are `static` methods?[^why-static]

[^why-static]: Since there is no *instance data*, we don't really have a notion of individual `Reporter` objects. So we *could* make them instance methods, but that's not really useful right now.

So, for example, if we were to make the following function call:

```java
Circle circle = new Circle(10);
Reporter.report(circle);
```

At *compile time*, the compiler determines which of the `report` methods best matches the provided input type.
In this case, the argument we've given to the `report` method is a single `Circle` object.
The compiler looks at all the `report` methods and identifies that, yes, there is a `report` method that expects a single `Circle` object as an argument.

After the code above is run, the text `"Circle: Radius: 10"` would be printed out.

If, instead, we called

```java
Reporter.report(23, 2);
```

The compiler would call the `report` method that takes two `int`s as inputs, and print `"Two ints: 23 2"`

However, if we did something like this...

```java
Circle circle = new Circle(10);
Circle anotherCircle = new Circle(20);
Reporter.report(circle, anotherCircle);
```

...we would run into a compiler error.
The compiler is unable to resolve the `report` call above, i.e., it cannot find a matching method in the `Reporter` class.

Since all of the above happens at *compile time*, i.e., before we ran the program, this is a form of **static dispatch**.

## Static Type and Dynamic Type

At this point, it's useful to take a little detour.

We've talked about how Java is *statically-typed*.
Take a minute to remind yourself of what it means to be *statically-typed*.
Put simply, it means that the types of variables are pretty much settled at *compile time*, as opposed to *run time*.

However, this is not quite the complete picture in Java.
In some situations, what the *compiler* thinks is the type of a variable may not necessarily be the same as what the *runtime*[^runtime] thinks the type is (with some limitations).

[^runtime]: You will see me write both "run time" (as two words), and "runtime" (as one word). When I write "run time" (as two words), I mean it as *at run time*, as in "while the program is running". When I write "runtime" (as one word), I mean *the program execution environment*. In most cases these are closely related.

But wait! Wasn't using a statically-typed language meant to save us from these ambiguities? How can this be?

### First look at inheritance

The Java standard library defines the [`Object`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html) class.
The `Object` class defines the behaviours that all objects are expected to support.
For example, the `Object` class defines these instance methods, among others:

- `equals(Object): boolean` — This method checks if the calling object is equal to the specified `Object`
- `toString(): String` — This method returns a string representation of the object

Every reference type in Java is a *child type* of `Object`.
That is, every reference type in Java *is an* `Object`, and can perform all of the actions defined in the `Object` class, even if those methods were not defined for that reference type.

This is due to ***inheritance***. All objects in Java inherit certain behaviours from the `Object` class, whether or not you, the programmer, explicitly told them to.

So, a `String` is an `Object`. A `Point` is an `Object`. The `CsCohort` and `Pitcher` classes that we created in previous lessons are `Object`s, even though we didn't explicitly mark them as such.

With that in mind, consider the following assignment statement:

```java
Object whatAmI = new Circle(3);
```

The type on the left-hand-side of the assignment operator (`Object`) does not match the type on the right-hand-side ( `Circle`).
But our compiler is still happy with that assignment statement.

This is because `Circle` is a *subtype* of `Object`, i.e., *it can do everything that an Object can do*.
Our compiler works this out due to the inheritance relationship between `Object` and `Circle`.
So our compiler is totally happy to say "ok, I will treat this variable as an `Object`, because I know it can do `Object` things".

So:

* The *compiler* sees the variable `whatAmI` as an `Object`. This is known as the variable's ***static type***.
* The *runtime* sees the variable `whatAmI` as a `Circle`. This is known as the variable's ***dynamic type***.

I'll say that again, because that's important: *the variable is treated slightly differently by the compiler and the runtime*.
As far as the compiler knows, it's an `Object`, but the actual *thing* that is stored in memory is a `Circle`.

If, instead, we did...

```java
Circle circ = new Circle(3);
```

...then we have no differences. The **static type** and the **dynamic type** of the variable are the same.

As a counterexample, consider the following.

```java
// This will break!
Circle whatAmI = new Object();
```

The line above would *not* compile, because we are declaring `whatAmI` to be a `Circle`, but then we're giving it an `Object` as a value.
That is, we're saying we want to make the variable do `Circle` actions (like, say, computing its area).
But in actuality, at runtime, the variable is an `Object`, which cannot compute an area — it doesn't even have a radius!
Our compiler is able to work out this incongruence, because it understands the direction of the relationship between `Circle` and `Object`; all `Circles` are `Objects`, but not all `Objects` are `Circles`.

## Back to method dispatch

All right, with that background, let's get back to method overloading.

In the `Reporter` example, we have the following two `report` functions:

- One that takes in a `Circle` as a parameter.
- One that takes in an `Object` as a parameter.

Let's look at some function calls with different inputs.

### Example 1

```java
Circle circle = new Circle(3);
Reporter.report(circle);
```

* The input's **static type** is `Circle`.
* The input's **dynamic type** is `Circle`.

**What will be printed?** Based on the *static type* of the variable, the compiler will decide which function should be called. In this case, it will decide on the `Reporter.report(Circle)` function, because the static type of the input is `Circle`.
So the printed output will be: `"Circle: Radius: 3"`

### Example 2

```java
Object obj = new Object();
Reporter.report(obj);
```

* The input's **static type** is `Object`.
* The input's **dynamic type** is `Object`.

**What will be printed?** The compiler will choose the `Reporter.report(Object)` function, because the static type of the input is `Object`.
So the printed output will be something like: `"Object: Object@324618"`[^toString]

[^toString]: The `Object` class's `toString` method is not terribly useful—it simply prints the `Object`'s location in memory. I've put in some random numbers here as a memory address — yours will differ if you run this code.

### Example 3

```java
Object circ = new Circle(3);
Reporter.report(circ);
```

* The input's **static type** is `Object`.
* The input's **dynamic type** is `Circle`.

**What will be printed?** The compiler will choose the `Reporter.report(Object)` function, because the static type of the input is `Object`.
However, the *dynamic type is still Circle*. That is, even if the compiler thinks it's an `Object`, the object that's sitting memory is still a `Circle`.

So we get the following output:

```
"Object: Radius: 3"
```

Let's think about how we got that, step by step:

* When we say *the object in memory is a `Circle`*, we are referring to the *data* held by a `Circle` (radius) and *behaviours* the `Circle` can perform (computing the area using `getArea`, or getting a string representation of the object using `toString`).
* So when the print statement in the `report` function implicitly calls the `toString` method, the following two things happen:
  1. The *compiler* checks if the static type (`Object`) has an instance method called `toString`. It does (see earlier in this lesson). If it didn't the code would not compile, and we wouldn't be able to run it at all. And this is a good check, because if the `Object` has a `toString`, we *know* that the `Circle` must also have a `toString`, because of their inheritance relationship.
  2. The *runtime* needs to decide which `toString` method to call. We know that there is one in the `Object` class, and we have one in the `Circle` class. Just like before, we have to *choose one*, i.e., we have to go through the process of *method dispatch*. Since the dispatch is now occurring at *run time*, it is known as ***dynamic dispatch***.
  3. In this case, since the object is a `Circle` at run time, we choose the `Circle`'s `toString` method. And we print the `Radius: 3` message.

Putting all of that together, we get the output: `"Object: Radius: 3"`

The `"Object"` in the string above came from the *static dispatch*, i.e., the choice of which `report` method to call. The `"Radius: 3"`  came from the *dynamic dispatch*, i.e., the choice of which `toString` method to call.

### Example 4

Let's consider a final example. Suppose, for a moment, that the `report(Circle)` method did *not* exist in `Reporter`. If you are following along with the code on your own machine, go ahead and delete or comment out that method now.
And suppose we did the following:

```java
Circle circ = new Circle(3);
Reporter.report(circ);
```

Now, our compiler cannot find a `report` method that takes a `Circle` as a parameter, because in this example it doesn't exist.
So the compiler will now "look upward", and instead look for a method that takes as its parameter a *parent class* of `Circle` (i.e., `Object`).
So the example above would compile, and it would print out `"Object: Circle@eb2857"` (or something similar).[^toString]

**Main takeway with method overloading/static dispatch.**

When a method has many overloads, the compiler checks the following rules, in this order, to determine which method should be called based on the arguments that are provided.

1. First, it looks for a method whose parameter type is an exact match with the input's static type.
2. If that is not successful, it looks for a method whose parameter has the closest "is a" relationship with the given input's static type. In **Example 4** above, a `Circle` *is an* `Object`, so the compiler would resolve to calling `report(Object)` if `report(Circle)` was not present.
3. If neither of the above resolves to a method, the compiler checks if the static type of the input can be *implicitly* converted to the expected parameter type for the method. For example, if the method takes in a `double` as a parameter, and we attempt to call it with an `int` as a parameter, the compiler will implicitly convert that `int` into a `double` and call the `double` method instead.

## Method overriding (dynamic dispatch)

Closely related to method overloading is the confusingly similarly named ***method overriding***.

When a _superclass_ (parent class) defines a behaviour and the _subclass_ (child class) does not, the subclass inherits that behaviour from the superclass.
For example, if we did not write a `toString` method in our `Circle` class, it would have inherited the `Object` `toString` behaviour instead.

*Method overriding* is when a method in a subclass has the same name and parameter list as a method in the superclass. The effect of this is that the subclass's method _overrides_ the superclass's method, thus replacing the superclass's behaviour that the subclass would otherwise inherit.

### Example 5

Let's illustrate this with an example.

Continuing with our running example, suppose we had *not* written a `toString` method in the `Circle` class.

The `Circle` class would then inherit the `toString` behaviour from the `Object` class.
If we did not want the `Object`'s `toString` behaviour, we need to *override* it, by writing our own `toString` class in `Circle.`

Here are the two classes again for the sake of convenience.
For this example, `Circle` has no `toString` method.

```java
// Reporter.java
public class Reporter {
    public static void report(Object obj) {
        System.out.println("Object:   " + obj);
    }

    public static void report(int x, int y) {
        System.out.println("Two ints: " + x + " " + y);
    }
}

// Circle.java
public class Circle {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    // This time with no toString method
}
```

Suppose we run the following code:

```java
Object obj = new Circle(3);
Reporter.report(obj);
```

* The input's **static type** is `Object`.
* The input's **dynamic type** is `Circle`.

The following will take place:

**First,** the compiler will look for a `report` function that takes an `Object` parameter. All good so far.

**Next**, within the `report` function, we reach the print statement.
Inside that print statement, `obj.toString()` is implicitly called.

**Next**, we should remember that, at runtime, `obj` is a `Circle`, because that was the dynamic type of our original input.
But `Circle` has no `toString` method now.

So what happens?

**This is where the inheritance relationship between `Circle` and `Object` comes into play.**
When the runtime fails to find a `toString` method in the `Circle` object, it will "search upward", checking the ancestors of `Circle`—in this case, `Object`.

So, what we will see printed is:

`"Circle: Object@eb78402"` (or something similar).[^toString]

If we were to give `Circle` a `toString` method of its own (as in the very first code snippets in this lesson), we would replace the "default" `toString` behaviour of all `Object`s with a specific `toString` method for `Circle`s.
This process is known as *method overriding*.

<!-- /*Overload resolution:
1) Exact match
2) Closest Is-A relationship
3) Can it be converted?
Resolution done at compile time (based on static type)
*/ -->
