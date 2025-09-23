# Arithmetic and testing

> This brief lesson is about arithmetic in Java.
> In the [previous lesson](../01_intro_to_java/), we learned the different *primitive data types* in Java, including the numerical data types `short`, `int`, `long`, `float`, and `double`.

In this lesson we'll establish some rules of evaluation for expressions involving these types.

By *expression*, I mean anything that evaluates to a value. For example `3 + 5` is an expression that evaluates to the value `8`. `"why are you yelling".toUpperCase()` is an expression that evaluates to the value `"WHY ARE YOU YELLING"`.

## Arithmetic operators

Ok, so. Arithmetic. We already know a few arithmetic operators:

* `+` for addition
* `-` for subtraction
* `*` for multiplication
* `/` for division
* `%` for modulo division (to obtain the remainder from a division operation)

All of these are *binary operators*. This means that each operator works on two *operands*. So in the expression `3 + 5`, `3` and `5` are operands, and `+` is the operator.

Unlike Python, which you learned in CSC 101 and 202, there is no `**` (exponentiation) or `//` (floor division) operator.
The two slashes (`//`) are reserved for inline comments in Java.

## Arithmetic involving operands of the same type

**When both operands in a binary expression are of the same type, then the result will also be of that type.**

In the examples below, remember from the [previous lesson](../01_intro_to_java/index.md) that when you simply use the literal values `5` and `2`, Java treats them as the `int` type (as opposed to the `short` or `long` type).
So the expressions below are all using `int` operands.

```java
int addResult = 5 + 2; // 7
int subResult = 5 - 2; // 3
int multResult = 5 * 2; // 10
int modResult = 5 % 2; // 1
```

So far so good.

But what if we start playing with division? Consider the expression `5 / 2`. If we were in a math class, the answer would be `2.5`, which is certainly not an integer.

```java
int divResult = 5 / 2; // What's the value of divResult?
```

Open up a terminal window and type `jshell` and hit enter.

This will place you in a Java shell, a place where you can run small Java programs, including testing out individual expressions.

Use `jshell` to evaluate the expression `5 / 2`.

```bash
jshell
jshell> 5 / 2
$1 ==> 2
```

You got the result 2!

However, if we were to divide `5.0 / 2.0`, we'd get the expected answer.

```bash
jshell> 5.0 / 2.0
$2 ==> 2.5
```

Remember that `5 / 2` is an `int / int` expression.
Per our rule above, Java is going to therefore produce an `int` in return.
A `double / double` expression, on the other hand, will result in a value of type `double`.

When the result of an integer division in Java is a fractional number (i.e., it has a decimal point), Java simply omits or *truncates* everything after the decimal point.

So the value of the expression `5 / 2` is `2`.

Note that simply changing the type of our result variable won't help.

```java
double divResult = 5 / 2; // Answer 2.0
```

Tracing the code above, it does the following:

* Evaluate `5 / 2` using the rules we talked about, getting the `int` result `2`.
* See that `divResult` is declared as a `double`, which means it cannot store the `int` value `2`.
* *Implicitly convert* the result `2` into a `double`, getting the value `2.0`, and store that instead.

So how would we get the answer `2.5` by dividing `5` and `2`?

## Arithmetic involving operands of different types

If you used two different types in an arithmetic expression, the result takes the "more precise" type.

If, instead of dividing two `ints`, you divided an `int` and a `double`, you would get a `double` in return.
Because at least one operand is using the *more precise* type, the result will default to that more precise type.

The expression below, `5 / 2.0` is a `int / double` expression.
So the result will be a `double`, which is the more precise data type of the two.

```java
double mixedDiv = 5 / 2.0; // Answer: 2.5
```

The same goes for using the different *integer types*.

Remember that both `int` and `long` are integer data types.
If you add an `int` and a `long` (or perform any operation between an `int` and a `long`), you'll get a `long` in return.
This is because the `long` is the more precise type (it takes up more memory, allowing for a larger range of numbers).

```java
long longAdd = 5 + 8L; // Will get the value 13 as a long
```

Attempting to store the result above in an `int` will result in a compiler error.

```java
int add = 5 + 8L; // Error: incompatible types: possible lossy conversion from long to int
```

And this makes sense. Suppose we evaluated the expression `5 + 2147483647L` (5 plus the maximum possible `int` value). We cannot possibly the store result in an `int` variable—it's too big!

## Type casting

Finally, you can tell your compiler to treat certain values as other types instead of their own types.
This is known as _type-casting_.
You are "casting" or converting a specific value into another type.

A type-cast is performed by typing the name of the type you want to convert *to* in parentheses before the value you want to convert.

```java
int basicInt = 5;
double nowItsADouble = (double) basicInt; // becomes 5.0
```

You can also lose data this way!

```java
double basicDouble = 5.2;
int nowItsAnInt = (int) basicDouble; // becomes 5; you lost the .2
```

Type-casting can be used when you have two integer values that you need to divide, but you need a precise result.

```java
int a = 132;
int b = 25;

double result = (double) a / b; // The result is 5.28
```

Tracing the code above, the following takes place:

- First, the expression `(double) a / b` needs to be evaluated. It is made up of two sub-expressions: `(double) a` and `b`.
- We evaluate the expression `(double) a`. The value of `a` is `132`, so applying the type-cast to 132, we get `132.0`.
- The sub-expression `b` evaluates to `25`.
- We are now ready to evaluate the overall expression `132.0 / 25`, and we get the value `5.28`.

In the example above, `a` was cast to a `double` before performing the division.
So it became a `double / int` operation, giving a `double` back as a result.

**Type-casting is a unary operation.**

Unlike the arithmetic operators we saw earlier, which were *binary operators* (i.e., they applied to 2 operands), type-casting is a *unary operator*. It applies to *only one operand*.

The type-cast will be applied to the value on the right of the type-cast operator (i.e., the data type you want to convert to).

Consider the following expressions and the steps involved in evaluating them:

- `(double) 132 / 25`
  - The steps of evaluation are described above

- `(double) (132 / 25)`
  - Here, because we've enclosed the division expression in parentheses, it takes precedence. `(132 / 25)` is evaluated first.
  - So as an intermediate expression we get `(double) (5)`. **Can you think why this is?**
  - The final value of the expression above will then be `5.0`, because the type-cast was applied to the value `5`.

**Finally, type-casting applies only to values, not to variables.**

Since Java is a statically-typed language, *you can never change the data type of a variable*.
You can only change the type of a value for use in a particular statement or expression.

Consider the same example from above.

```java
int a = 132;
int b = 25;

double result = (double) a / b;
```

In the code above, the type-cast only applies to the *value* `132` within the expression. The data type of `a` has not changed, and future uses of `a` will still evaluate to `132`, ***not*** `132.0`.
