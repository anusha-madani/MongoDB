# MongoDB Assignment 02 — Aggregation Pipelines & CRUD Operations

A MongoDB Playground project (`playground-1_mongodb.js`) that solves four practical tasks using the **Aggregation Framework** and **CRUD operations**. Every task is written as one or more MongoDB queries that can be run directly from the MongoDB extension in VS Code.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database & Collections](#database--collections)
4. [How to Run](#how-to-run)
5. [Task 1 — Even / Odd Program](#task-1--even--odd-program)
6. [Task 2 — Leap Year Program](#task-2--leap-year-program)
7. [Task 3 — Student Marksheet](#task-3--student-marksheet)
8. [Task 4 — Inventory Management System](#task-4--inventory-management-system)
9. [MongoDB Operators Used](#mongodb-operators-used)
10. [Key Learnings](#key-learnings)
11. [Important Notes](#important-notes)

---

## Project Overview

The goal of this assignment is to practise real-world data processing in MongoDB without any application code. All logic (calculations, filtering, grouping, grading, reporting) is done inside the database using aggregation pipelines.

| Task | Topic               | Collection  | Main Skills                                                            |
| ---: | ------------------- | ----------- | ---------------------------------------------------------------------- |
|    1 | Even / Odd numbers  | `numbers`   | `$mod`, `$match`, `$group`, `$cond`                                    |
|    2 | Leap year detection | `years`     | `$or`, `$and`, `$nor`, `$min`, `$max`                                  |
|    3 | Student marksheet   | `marksheet` | `$add`, `$divide`, `$round`, `$switch`, `$skip`, `$limit`              |
|    4 | Inventory system    | `inventory` | `insertOne`, `updateOne`, `updateMany`, `upsert`, `deleteOne`, reports |

---

## Tech Stack

- **Database:** MongoDB
- **Tool:** MongoDB Playground (VS Code + MongoDB for VS Code extension)
- **Language:** JavaScript (MongoDB Shell syntax)

---

## Database & Collections

**Database name:** `mongodbassignment02`

```js
use('mongodbassignment02');
```

| Collection  | Documents                       | Fields                                                                                                       |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `numbers`   | 12                              | `number`                                                                                                     |
| `years`     | 12                              | `year`                                                                                                       |
| `marksheet` | 10                              | `rollNo`, `name`, `course`, `urdu`, `english`, `mathematics`, `physics`, `chemistry`, `computer`, `islamiat` |
| `inventory` | 12 (+1 added during operations) | `itemCode`, `itemName`, `category`, `quantity`, `unitPrice`, `reorderLevel`, `supplier`                      |

---

## How to Run

1. Install **MongoDB** and **VS Code** with the **MongoDB for VS Code** extension.
2. Connect to your MongoDB server (e.g. `mongodb://localhost:27017`).
3. Open `playground-1_mongodb.js`.
4. The sample-data `insertMany()` blocks are **commented out**. Uncomment the block for the task you want, run it **once** to load data, then comment it again.
5. Select a query (or the whole file) and click **Play** (▶). Results appear in the output panel.

> The output panel shows the result of the **last** command only. To view each query's result, run queries one at a time by selecting them.

---

## Task 1 — Even / Odd Program

**Collection:** `numbers`
**Sample data:** `12, 7, 0, -4, -7, 15, 22, 3, -1, 1048576, 8, 19` (includes zero, negative numbers and a very large number to test edge cases).

| Part          | What it does                                            | Approach                                            |
| ------------- | ------------------------------------------------------- | --------------------------------------------------- |
| **A**         | Shows every number with its remainder when divided by 2 | `$set` + `$mod`                                     |
| **B**         | Lists all **even** numbers in ascending order           | `$match` remainder `0`, `$sort` ascending           |
| **C**         | Lists all **odd** numbers in descending order           | `$match` remainder in `[1, -1]`, `$sort` descending |
| **D**         | Counts total even and total odd numbers                 | `$group` with `$sum` + `$cond`                      |
| **E**         | Top 3 largest even numbers                              | `$sort` descending + `$limit: 3`                    |
| **Challenge** | Labels each number as `"Even"` or `"Odd"`               | `$cond` inside `$set`                               |

**Important point:** In MongoDB, `$mod` keeps the sign of the dividend, so `-7 % 2` returns `-1` (not `1`). That is why odd numbers are matched with `{ $in: [1, -1] }` — otherwise negative odd numbers would be missed.

**Expected results**

- Even numbers (6): `-4, 0, 8, 12, 22, 1048576`
- Odd numbers (6): `19, 15, 7, 3, -1, -7`
- Top 3 even: `1048576, 22, 12`

---

## Task 2 — Leap Year Program

**Collection:** `years`
**Sample data:** `2004, 2026, 1900, 2000, 2100, 2400, 2016, 2025, 1800, 2003, 2020, 1999`

**Leap year rule used:**

```
(year % 400 == 0)  OR  (year % 4 == 0 AND year % 100 != 0)
```

| Part          | What it does                                    | Approach                                   |
| ------------- | ----------------------------------------------- | ------------------------------------------ |
| **A**         | Shows each year with `rem4`, `rem100`, `rem400` | `$set` + `$mod`                            |
| **B**         | Lists all leap years (ascending)                | `$match` with `$or` / `$and`               |
| **C**         | Lists all non-leap years (ascending)            | `$match` with `$nor` (exact opposite of B) |
| **D**         | Counts total leap and non-leap years            | `isLeap` flag (1/0) + `$group`             |
| **E**         | Finds the oldest and latest leap year           | `$min` and `$max` after filtering          |
| **Challenge** | Shows days in each year (`366` or `365`)        | `$cond` inside `$set`                      |

**Expected results**

- Leap years (5): `2000, 2004, 2016, 2020, 2400`
- Non-leap years (7): `1800, 1900, 1999, 2003, 2025, 2026, 2100`
- Oldest leap year: `2000` — Latest leap year: `2400`

> Years like `1800`, `1900` and `2100` are divisible by 4 and 100 but not by 400, so they are **not** leap years.

---

## Task 3 — Student Marksheet

**Collection:** `marksheet`
**Data:** 10 students across the courses `ADSE`, `DISM` and `HDSE`, each with marks in 7 subjects (Urdu, English, Mathematics, Physics, Chemistry, Computer, Islamiat). Each subject is out of 100, so the total is **700**.

| Part          | What it does                                                     | Approach                                            |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| **A**         | Total marks and percentage (2 decimals) for each student         | `$add`, `$divide`, `$multiply`, `$round`            |
| **B**         | Students ranked by total marks (highest first)                   | `$sort` descending                                  |
| **C**         | Top 3 students                                                   | `$sort` + `$limit: 3`                               |
| **D**         | Students who failed in **at least one** subject (< 40)           | `$match` with `$or`                                 |
| **E**         | Students who passed **all** subjects (≥ 40) **and** have ≥ 50%   | `$match` with `$gte` on all subjects + percentage   |
| **F**         | Class summary: total students, average, highest, lowest total    | `$group` with `$sum`, `$avg`, `$max`, `$min`        |
| **G**         | Course-wise summary: students, average percentage, highest total | `$group` by `$course`, sorted by average percentage |
| **H**         | Students ranked 5 to 8                                           | `$sort` + `$skip: 4` + `$limit: 4`                  |
| **Challenge** | Assigns a grade to every student                                 | `$switch` on percentage                             |

**Grading scale used in the challenge**

| Percentage   | Grade |
| ------------ | ----- |
| 80 and above | A-1   |
| 70 – 79.99   | A     |
| 60 – 69.99   | B     |
| 50 – 59.99   | C     |
| 40 – 49.99   | D     |
| Below 40     | F     |

**Expected results**

| Rank | Roll No | Name    | Course | Total | Percentage | Grade |
| ---: | ------: | ------- | ------ | ----: | ---------: | ----- |
|    1 |     104 | Anas    | HDSE   |   646 |      92.29 | A-1   |
|    2 |     101 | Amimah  | ADSE   |   627 |      89.57 | A-1   |
|    3 |     110 | Ayesha  | ADSE   |   589 |      84.14 | A-1   |
|    4 |     108 | Asher   | DISM   |   532 |      76.00 | A     |
|    5 |     103 | Anusha  | ADSE   |   513 |      73.29 | A     |
|    6 |     106 | Adeeba  | HDSE   |   458 |      65.43 | B     |
|    6 |     109 | Alishba | HDSE   |   458 |      65.43 | B     |
|    8 |     102 | Ahmed   | DISM   |   380 |      54.29 | C     |
|    9 |     105 | Amna    | DISM   |   355 |      50.71 | C     |
|   10 |     107 | Ali     | ADSE   |   213 |      30.43 | F     |

- **Failed in at least one subject (Part D):** Ahmed, Amna, Ali
- **Passed all subjects with ≥ 50% (Part E):** Amimah, Anusha, Anas, Adeeba, Asher, Alishba, Ayesha
- **Class summary (Part F):** 10 students, average total `477.1`, highest `646`, lowest `213`
- **Course-wise (Part G):** HDSE ≈ 74.38% (3 students), ADSE ≈ 69.36% (4 students), DISM ≈ 60.33% (3 students)

> Ahmed and Amna have a total percentage above 50%, but each failed one subject, so they are correctly excluded in Part E.

---

## Task 4 — Inventory Management System

**Collection:** `inventory`
**Data:** 12 electronics and office items with code, name, category, quantity, price, reorder level and supplier.

### Part 1 — Operations (CRUD)

| #   | Operation              | Command                        | Description                                                   |
| --- | ---------------------- | ------------------------------ | ------------------------------------------------------------- |
| 1   | Add new item           | `insertOne()`                  | Adds `ITM-013` Ethernet Cable 5m                              |
| 2   | Record a sale          | `updateOne()` + `$inc: -3`     | Customer buys 3 units of `ITM-001`                            |
| 3   | Restock                | `updateOne()` + `$inc: +50`    | Adds 50 units to low-stock `ITM-002`                          |
| 4   | Price increase         | `updateMany()` + `$mul: 1.05`  | Raises all **Furniture** prices by 5%                         |
| 5a  | Upsert (existing code) | `updateOne()` + `upsert: true` | Updates the price of `ITM-001` to 1250 (no duplicate created) |
| 5b  | Upsert (new code)      | `updateOne()` + `upsert: true` | Inserts `ITM-999` Wireless Charger because it does not exist  |
| 6   | Remove item            | `deleteOne()`                  | Deletes the discontinued item `ITM-999`                       |

### Part 2 — Reports (Aggregation)

| Report        | Description                                                                                        | Key Stages                       |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| **A**         | Stock value per item (`quantity × unitPrice`)                                                      | `$set`, `$multiply`              |
| **B**         | Total value of the entire inventory                                                                | `$group`, `$sum`                 |
| **C**         | Category-wise summary: item count, total quantity, avg / highest / lowest price, total stock value | `$group`, `$avg`, `$max`, `$min` |
| **D**         | Reorder list (quantity ≤ reorder level) with a `shortage` field                                    | `$expr` + `$lte`, `$subtract`    |
| **E**         | Out-of-stock items (`quantity = 0`)                                                                | `$match`                         |
| **F**         | Top 5 most valuable items by stock value                                                           | `$sort`, `$limit: 5`             |
| **G**         | Discount preview — 10% off, rounded to 0 decimals                                                  | `$set`, `$round`                 |
| **H**         | Pagination: page 2, 5 items per page, sorted by name                                               | `$sort`, `$skip: 5`, `$limit: 5` |
| **Challenge** | Category with the highest total stock value                                                        | `$group`, `$sort`, `$limit: 1`   |

### Report G — Does the discount change stored prices?

**No.** An aggregation pipeline only transforms the output; it never modifies stored documents. This is proven by running `db.inventory.find()` afterwards, which still shows the original `unitPrice` values.

### Operations vs Report G

| Point                 | Price increase (Part 1, step 4) | Discount preview (Report G)           |
| --------------------- | ------------------------------- | ------------------------------------- |
| Command               | `updateMany()` with `$mul`      | `aggregate()` with `$set`             |
| Effect on stored data | **Permanent** change            | **No change** — temporary output only |

### Expected results (after Part 1 operations are run once)

- **Total inventory value:** `1,185,950`
- **Out-of-stock items:** 27-inch Monitor (`ITM-003`), Gaming Headset (`ITM-005`)
- **Items needing reorder:** 27-inch Monitor, USB-C Hub, Gaming Headset, Laptop Stand, Office Chair
- **Category with highest stock value:** `Storage` — `396,000`
- **Category stock values:** Storage 396,000 · Accessories 344,400 · Displays 165,000 · Furniture 116,550 · Cables 108,000 · Audio 56,000

---

## MongoDB Operators Used

| Category             | Operators / Commands                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Pipeline stages**  | `$set`, `$project`, `$match`, `$sort`, `$group`, `$limit`, `$skip`                     |
| **Arithmetic**       | `$mod`, `$add`, `$subtract`, `$multiply`, `$divide`, `$round`                          |
| **Comparison**       | `$eq`, `$ne`, `$gte`, `$lt`, `$lte`, `$in`                                             |
| **Logical**          | `$or`, `$and`, `$nor`                                                                  |
| **Conditional**      | `$cond`, `$switch`                                                                     |
| **Accumulators**     | `$sum`, `$avg`, `$max`, `$min`                                                         |
| **Other**            | `$expr`                                                                                |
| **CRUD**             | `insertMany`, `insertOne`, `updateOne`, `updateMany`, `deleteOne`, `find`, `aggregate` |
| **Update operators** | `$inc`, `$mul`, `$set`, `upsert`                                                       |

---

## Key Learnings

- **Aggregation pipelines** process data in stages, where each stage passes its output to the next one.
- `$mod` returns a result with the **same sign as the dividend**, so negative odd numbers give `-1`.
- `$nor` is the clean way to get the exact opposite of a complex `$or` / `$and` condition.
- **`$cond`** works like an if-else and **`$switch`** works like multiple if-else branches (used for grading).
- `$skip` + `$limit` is the standard way to build **pagination**.
- **`upsert`** updates a document if it exists and inserts it if it does not.
- **`$expr`** lets us compare two fields of the same document (e.g. `quantity` vs `reorderLevel`).
- Aggregation **reads** data only; `update` commands **permanently change** it.

---

## Important Notes

- The `insertMany()` blocks are commented out on purpose. **Run each one only once**, otherwise duplicate documents will be created.
- The Task 4 operations (Part 1) are **not idempotent** — running them again will reduce/increase quantities and prices again (e.g. `$inc` and `$mul`). If you need a clean start, drop the collection and re-insert the data.
- `db.createCollection('numbers')` will give an error if the collection already exists. This is harmless and can be ignored or commented out after the first run.
- Reported results above assume the sample data and Part 1 operations were executed exactly once.

---

## Project Structure

```
.
├── playground-1_mongodb.js   # All queries for Tasks 1–4
└── README.md                 # Project documentation
```
