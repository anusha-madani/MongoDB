/* ================================================================
   ASSIGNMENT 01 — MongoDB CRUD & Operators (Bookstore Database)
   Based on: Lecture 01 (CRUD Basics) + Lecture 02 (Query & Update Operators)
   Database used: BookStore
   Collections: books, customers, orders
   ================================================================ */


/* ================================================================
   SETUP
   ================================================================ */

// use BookStore
// Output: switched to db BookStore

db.createCollection("books")
// Output: { ok: 1 }

db.createCollection("customers")
// Output: { ok: 1 }

db.createCollection("orders")
// Output: { ok: 1 }


/* ---------------- Seed: books collection (6 books) ---------------- */
db.books.insertMany([
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    price: 35,
    stock: 12,
    tags: ["tech", "bestseller", "paperback"],
    rating: 4.8
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Programming",
    price: 42,
    stock: 8,
    tags: ["tech", "guide", "paperback", "classic"], // >3 tags
    rating: 4.9
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    price: 20,
    stock: 25,
    tags: ["bestseller", "growth"],
    rating: 4.7
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Self-Help",
    price: "18",      // stored as string on purpose (used later for $type task)
    stock: 0,         // stock: 0 requirement satisfied
    tags: ["startup", "business"],
    rating: 4.3
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    price: 28,
    stock: 15,
    tags: ["history", "bestseller", "non-fiction", "classic"], // >3 tags
    rating: 4.6
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Fiction",
    price: "15",      // stored as string on purpose
    stock: 5,
    tags: ["sci-fi", "classic"],
    rating: 2.8
  }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('66ea10a1869fc743f3181f10'),
    '1': ObjectId('66ea10a1869fc743f3181f11'),
    '2': ObjectId('66ea10a1869fc743f3181f12'),
    '3': ObjectId('66ea10a1869fc743f3181f13'),
    '4': ObjectId('66ea10a1869fc743f3181f14'),
    '5': ObjectId('66ea10a1869fc743f3181f15')
  }
}
*/


/* ---------------- Seed: customers collection (4 customers) ---------------- */
db.customers.insertMany([
  { name: "Ali Khan",     email: "ali@example.com",   city: "Karachi",   membership: "Premium" },
  { name: "Sara Ahmed",   email: "sara@example.com",  city: "Lahore",    membership: "Regular" },
  { name: "Usman Raza",   email: "usman@example.com", city: "Karachi",   membership: "Regular" },
  { name: "Ayesha Malik", email: "ayesha@example.com", city: "Islamabad", membership: "Premium" }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('66ea10b2869fc743f3181f16'),
    '1': ObjectId('66ea10b2869fc743f3181f17'),
    '2': ObjectId('66ea10b2869fc743f3181f18'),
    '3': ObjectId('66ea10b2869fc743f3181f19')
  }
}
*/


/* ---------------- Seed: orders collection (5 orders) ---------------- */
db.orders.insertMany([
  {
    customerName: "Ali Khan",
    items: [
      { bookTitle: "Clean Code", quantity: 1, unitPrice: 35 }
    ],
    status: "Pending",
    orderDate: "2026-09-10"
  },
  {
    customerName: "Sara Ahmed",
    items: [
      { bookTitle: "Atomic Habits", quantity: 3, unitPrice: 20 }
    ],
    status: "Shipped",
    orderDate: "2026-09-12"
  },
  {
    customerName: "Ali Khan",
    items: [
      { bookTitle: "The Pragmatic Programmer", quantity: 2, unitPrice: 42 }
    ],
    status: "Delivered",
    orderDate: "2026-09-14"
  },
  {
    customerName: "Usman Raza",
    items: [
      { bookTitle: "Dune", quantity: 1, unitPrice: 15 }
    ],
    status: "Pending",
    orderDate: "2026-09-15"
  },
  {
    customerName: "Ayesha Malik",
    items: [
      { bookTitle: "Sapiens", quantity: 1, unitPrice: 28 }
    ],
    status: "Shipped",
    orderDate: "2026-09-18"
  }
])
/* Output:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('66ea10c5869fc743f3181f1a'),
    '1': ObjectId('66ea10c5869fc743f3181f1b'),
    '2': ObjectId('66ea10c5869fc743f3181f1c'),
    '3': ObjectId('66ea10c5869fc743f3181f1d'),
    '4': ObjectId('66ea10c5869fc743f3181f1e')
  }
}
*/


/* ================================================================
   TASK A — Basic CRUD (Lecture 01)
   ================================================================ */

// 1. Insert one more book using insertOne()
db.books.insertOne({
  title: "Design Patterns",
  author: "Erich Gamma",
  genre: "Programming",
  price: 50,
  stock: 10,
  tags: ["tech", "advanced", "architecture"],
  rating: 4.5
})
/* Output:
{ acknowledged: true, insertedId: ObjectId('66ea10d0869fc743f3181f1f') }
*/


// 2. Fetch all documents from books
db.books.find()
/* Output: Returns all 7 book documents currently in the collection 
   (Clean Code, The Pragmatic Programmer, Atomic Habits, Zero to One, 
   Sapiens, Dune, Design Patterns) */


// 3. Fetch only the books belonging to one specific genre
db.books.find({ genre: "Programming" })
/* Output:
[
  { title: 'Clean Code', genre: 'Programming', price: 35, ... },
  { title: 'The Pragmatic Programmer', genre: 'Programming', price: 42, ... },
  { title: 'Design Patterns', genre: 'Programming', price: 50, ... }
]
*/


// 4. Update one customer's city using updateOne()
db.customers.updateOne({ name: "Sara Ahmed" }, { $set: { city: "Rawalpindi" } })
/* Output:
{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
Sara Ahmed's city is now updated to "Rawalpindi" */


// 5. Delete any one order using deleteOne()
db.orders.deleteOne({ customerName: "Usman Raza" })
/* Output: { acknowledged: true, deletedCount: 1 } */


/* ================================================================
   TASK B — Comparison & Logical Operators (Lecture 02, Part 1 & 2)
   ================================================================ */

// 6. Books priced greater than a chosen value ($gt 25)
db.books.find({ price: { $gt: 25 } })
/* Output: Clean Code (35), The Pragmatic Programmer (42), 
   Sapiens (28), Design Patterns (50)
   (Note: "Zero to One" and "Dune" price is string, so numeric $gt does not match them.) */


// 7. Books priced between two values ($gt + $lt combined)
db.books.find({ price: { $gt: 15, $lt: 35 } })
/* Output: Atomic Habits (20), Sapiens (28) */


// 8. Books that are either out of stock OR rated below 3.0 ($or)
db.books.find({ $or: [ { stock: 0 }, { rating: { $lt: 3.0 } } ] })
/* Output: Zero to One (stock: 0), Dune (rating: 2.8) */


// 9. Books that are neither in a specific genre nor above a specific price ($nor)
db.books.find({ $nor: [ { genre: "History" }, { price: { $gt: 40 } } ] })
/* Output: Clean Code, Atomic Habits, Zero to One, Dune */


// 10. Customers whose membership is "Premium" AND city is a specific city ($and)
db.customers.find({ $and: [ { membership: "Premium" }, { city: "Karachi" } ] })
/* Output: Ali Khan */


// 11. Books whose genre is $in a list of at least 2 genres
db.books.find({ genre: { $in: ["Programming", "Self-Help"] } })
/* Output: Clean Code, The Pragmatic Programmer, Atomic Habits, Zero to One, Design Patterns */


// 12. Customers whose city is $nin a list of 2 cities
db.customers.find({ city: { $nin: ["Lahore", "Islamabad"] } })
/* Output: Ali Khan (Karachi), Usman Raza (Karachi), Sara Ahmed (Rawalpindi) */


/* ================================================================
   TASK C — Element, Type & Array Operators (Lecture 02, Part 2)
   ================================================================ */

// 13. Books where the tags field $exists
db.books.find({ tags: { $exists: true } })
/* Output: All 7 books match because every book document has a tags array */


// 14. Books with exactly 2 tags ($size)
db.books.find({ tags: { $size: 2 } })
/* Output: Atomic Habits, Zero to One, Dune */


// 15. Confirm price is stored as a numeric type ($type)
db.books.find({ price: { $type: "number" } })
/* Output: Returns Clean Code, The Pragmatic Programmer, Atomic Habits, Sapiens, Design Patterns.
   Excludes "Zero to One" and "Dune" as their prices were inserted as String. */


// 16. Books whose tags array contains BOTH specific tags together ($all)
db.books.find({ tags: { $all: ["bestseller", "paperback"] } })
/* Output: Clean Code */


// 17. Order item where quantity > 2 AND unitPrice > 15 on the SAME item ($elemMatch)
db.orders.find({ items: { $elemMatch: { quantity: { $gt: 2 }, unitPrice: { $gt: 15 } } } })
/* Output: Sara Ahmed's order (Atomic Habits, quantity: 3, unitPrice: 20) */


// 18. Books whose title starts with a specific letter ($regex)
db.books.find({ title: { $regex: "^C", $options: "i" } })
/* Output: Clean Code */


/* ================================================================
   TASK D — Update Operators (Lecture 02, Part 3)
   ================================================================ */

// 19. Increase price of one book by 10% using $mul
db.books.updateOne({ title: "Clean Code" }, { $mul: { price: 1.10 } })
/* Output:
{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
New price for Clean Code: 38.5 */


// 20. Use $inc to reduce a book's stock by 1 (simulate a sale)
db.books.updateOne({ title: "Atomic Habits" }, { $inc: { stock: -1 } })
/* Output: matchedCount: 1, modifiedCount: 1
   New stock for Atomic Habits: 24 (was 25) */


// 21. Use $max to only raise rating if new value is actually higher
db.books.updateOne({ title: "Dune" }, { $max: { rating: 4.0 } })
/* Output: matchedCount: 1, modifiedCount: 1 (Rating updated from 2.8 to 4.0) */


// 22. Rename a field in customers document ($rename)
db.customers.updateMany({}, { $rename: { "membership": "tier" } })
/* Output: matchedCount: 4, modifiedCount: 4
   All customer documents now have 'tier' field instead of 'membership' */


// 23. Update a nested field using positional dot notation
db.orders.updateOne({ customerName: "Ali Khan" }, { $set: { "items.0.quantity": 2 } })
/* Output: matchedCount: 1, modifiedCount: 1
   First item's quantity in Ali Khan's order updated from 1 to 2 */


// 24. upsert: true — insert a brand-new customer if no match is found
db.customers.updateOne(
   { email: "bilal@example.com" },
   { $setOnInsert: { name: "Bilal Hassan", city: "Peshawar", tier: "Regular" } },
   { upsert: true }
)
/* Output:
{
  acknowledged: true,
  insertedId: ObjectId('66ea1101869fc743f3181f20'),
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 1
}
New customer "Bilal Hassan" created via upsert */


// 25. Add a new tag with $push, then try $addToSet with the same tag
db.books.updateOne({ title: "Clean Code" }, { $push: { tags: "recommended" } })
/* Output: modifiedCount: 1
   tags: ["tech", "bestseller", "paperback", "recommended"] */

db.books.updateOne({ title: "Clean Code" }, { $addToSet: { tags: "recommended" } })
/* Output: modifiedCount: 0
   ("recommended" already exists, so $addToSet prevents duplicate) */


// 26. Remove one tag from a book ($pull)
db.books.updateOne({ title: "Clean Code" }, { $pull: { tags: "recommended" } })
/* Output: modifiedCount: 1
   tags: ["tech", "bestseller", "paperback"] */


// 27. Remove two tags from a book at once ($pullAll)
db.books.updateOne({ title: "The Pragmatic Programmer" }, { $pullAll: { tags: ["guide", "classic"] } })
/* Output: modifiedCount: 1
   tags: ["tech", "paperback"] */


// 28. Remove the last tag from a book's array ($pop)
db.books.updateOne({ title: "Sapiens" }, { $pop: { tags: 1 } })
/* Output: modifiedCount: 1
   tags: ["history", "bestseller", "non-fiction"] ("classic" removed from end) */


/* ================================================================
   TASK E — Bonus
   ================================================================ */

// 29. updateMany() — apply a $mul price increase to every book in one genre
db.books.updateMany({ genre: "Programming" }, { $mul: { price: 1.05 } })
/* Output: matchedCount: 3, modifiedCount: 3
   All Programming books prices increased by 5% */


// 30. Combined query across operators
db.customers.find({ $and: [ { tier: "Premium" }, { city: "Karachi" } ] })
/* Output: Ali Khan */

db.orders.find({
   $and: [
     { customerName: "Ali Khan" },
     { status: "Pending" },
     { items: { $elemMatch: { quantity: { $gte: 1 } } } }
   ]
})
/* Output:
[
  {
    customerName: 'Ali Khan',
    items: [ { bookTitle: 'Clean Code', quantity: 2, unitPrice: 35 } ],
    status: 'Pending',
    orderDate: '2026-09-10'
  }
] */

// ---------------- END OF ASSIGNMENT ----------------
exit