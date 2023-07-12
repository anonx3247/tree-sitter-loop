-- single-line comments
/* Multi-line
comments */

x = 3 -- variables are simply assigned a value and the type is inferred
mut y = 5 -- mutable variables must be declared as such

phrase = "Hello, World!" -- all strings are UTF-8

println(phrase) -- >Hello, World!

struct Person {
  name: str
  age: u8
  job: str? -- the `?` marks this parameter as optional
}

bob = Person(name: "Bob", age: 22) -- notice no job was specified

fn greet(p Person) -> void { -- this function takes a person and returns nothing
  print(
    if job is none {
      "Hello, {p.name}, you are {p.age} years old!") -- string interpolation
    } else {
      "Hello, {p.name}, you are {p.age} years old, and your job is {p.job}"
    }
  )
}


bob.greet() /* this is method notation, you can always use the first argument of a function
as the "object" upon which the "method" is called */

greet(name: "Jim", age: 30) -- notice we can directly access the struct's members in the function call
greet(job: "Cashier", 
      name: "Elena", 
      age: 30) -- And they don't have to be in order

enum Sex { --defining enum types
  Male
  Female
}

fn guess_sex(name: str) -> Sex {
  ret switch name[name.len()-1] as n { -- switch with an alias
    n == 'a' => Female
    n == 'o' => Male
    def => if random_f64(from: 0, to: 1) < 0.5 { Male } else { Female }
  }
}

bob.guess_sex() -- notice you can call it on bob as bob has a `name: str` field

guess_sex("Elena") -- the "name:" is not needed as the function only takes one argument


fn is_prime(n: u64) -> bool {
  for i in 2..n { -- range from 2 to n-1
    if n % i == 0 {
      ret false
    }
  }
  ret true
}

first_primes = [u64(i) for i in 1..100 if is_prime(i)] -- list comprehension

fn stats(vals: []u64) -> f64, f64, f64 { -- []type means a list of type `type`
  mut min, max = vals[0], vals[0] -- multiple assignment
  for elem in vals {
    if elem > max {
      max = elem
    }
    if elem < min {
      min = elem
    }
  }

  mean = sum(vals) / len(vals)

  ret min, max, mean -- return a tuple
}

fn sum (list: []T) -> T { -- generics, here T can be any type (note it will only be compiled for places where it is called)
  mut s = 0
  for i in list {
    s += i
  }
  ret s
}

/*
optionally for generics, we can specify a list of types which we want the compiler to
try and define it for (any other calls with different types will also be implemented
but this is to ensure it is implemented regardless of whether it is called on these types)
*/

fn add(a: T, b: T) -> T {
  ret a + b  
}


-- The #debug flag can be used in other places to include code to execute only in "debug" mode

fn calc_n_primes(n: u64) -> []u64 {
  mut primes: u64 = [2] -- assignment with type specified

  mut i = 2
  #debug t = time.now()
  while len(primes) < n {
    i += 1
    if is_prime(i) {
      primes += [i]
    }
  }
  #debug t2 = time.now()
  #debug println("For {n}, took {t2-t1}")
}

-- thus if we compile with `loop --debug` the debug code will be included and the times will be reported


fn retrieve_file() -> file? {
  f = open("~/Documents/test.txt") -- will return either the file or an error

  if f is err {
    println("Error: {f}")
    ret none
  } else {
    ret f
  }
}

-- optionally we can propagate the error with `!` to return it

fn open_csv(path: str) -> csv.Reader! { -- `!` marks it as an enum {csv.Reader, err}
  f = open(path)! -- will return the error if there is any
  r = csv.reader(from: f) catch ex { -- catch statement used to handle errors
    println("Unable to cread as csv: {ex}")
    ret ex
  }

  ret r
}
