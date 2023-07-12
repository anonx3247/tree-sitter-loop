x = 3 
mut y = 5 

phrase = "Hello, World!" 

println(phrase) 

struct Person {
  name: str
  age: u8
  job: str? 
}

bob = Person(name: "Bob", age: 22) 

fn greet(p: Person) -> none { 
  print(
    if job is none {
      "Hello, {p.name}, you are {p.age} years old!"
    } else {
      "Hello, {p.name}, you are {p.age} years old, and your job is {p.job}"
    }
  )
}


bob.greet() 

greet(name: "Jim", age: 30) 
greet(job: "Cashier", 
      name: "Elena", 
      age: 30) 

enum Sex { 
  Male,
  Female
}

fn guess_sex(name: str) -> Sex {
  ret switch name[name.len()-1] as n { 
    n == 'a' => Female
    n == 'o' => Male
    def => if random_f64(from: 0, to: 1) < 0.5 { Male } else { Female }
  }
}

bob.guess_sex() 

guess_sex("Elena") 


fn is_prime(n: u64) -> bool {
  for i in 2..n { 
    if n % i == 0 {
      ret false
    }
  }
  ret true
}

first_primes = [u64(i) for i in 1..100 if is_prime(i)] 

fn stats(vals: []u64) -> f64, f64, f64 { 
  mut min, max = vals[0], vals[0] 
  for elem in vals {
    if elem > max {
      max = elem
    }
    if elem < min {
      min = elem
    }
  }

  mean = sum(vals) / len(vals)

  ret min, max, mean 
}

fn sum (list: []T) -> T { 
  mut s = 0
  for i in list {
    s += i
  }
  ret s
}



fn add(a: T, b: T) -> T {
  ret a + b  
}




fn calc_n_primes(n: u64) -> []u64 {
  mut primes: u64 = [2] 

  mut i = 2
  debug t = time.now()
  while len(primes) < n {
    i += 1
    if is_prime(i) {
      primes += [i]
    }
  }
  debug t2 = time.now()
  debug println("For {n}, took {t2-t1}")
}




fn retrieve_file() -> File? {
  f = open("~/Documents/test.txt") 

  if f is err {
    println("Error: {f}")
    ret none
  } else {
    ret f
  }
}



fn open_csv(path: str) -> csv::Reader! { 
  f = open(path)! 
  r = csv.reader(from: f) catch ex { 
    println("Unable to cread as csv: {ex}")
    ret ex
  }

  ret r
}
