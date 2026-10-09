/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('mongodbassignment02');

db.createCollection('numbers');

// TASK 01 Even Odd Program
/*
db.numbers.insertMany([
  { number: 12 },
  { number: 7 },
  { number: 0 },
  { number: -4 },
  { number: -7 },
  { number: 15 },
  { number: 22 },
  { number: 3 },
  { number: -1 },
  { number: 1048576 },
  { number: 8 },
  { number: 19 }
]);
*/

// TASK 1 - Part A
db.numbers.aggregate([
  {
    $set: {
      remainder: { $mod: ["$number", 2] }
    }
  },
  {
    $project: {
      _id: 0,
      number: 1,
      remainder: 1
    }
  }
]);

// TASK 1 - Part B
db.numbers.aggregate([
  {
    $set: { remainder: { $mod: ["$number", 2] } }
  },
  {
    $match: { remainder: 0 }
  },
  {
    $sort: { number: 1 }
  },
  {
    $project: { _id: 0, 
        number: 1, 
        remainder: 1 
    }
  }
]);

// // TASK 1 - Part C
// In MongoDB, $mod returns a remainder with the same sign as the dividend. 
// For example, -7 % 2 gives -1, not 1. To accurately catch all odd numbers 
// (both positive and negative), we match where remainder is either 1 or -1.
db.numbers.aggregate([
  {
    $set: { remainder: { $mod: ["$number", 2] } }
  },
  {
    $match: { remainder: { $in: [1, -1] } }
  },
  {
    $sort: { number: -1 }
  },
  {
    $project: { 
        _id: 0, 
        number: 1,
        remainder: 1
     }
  }
]);

// TASK 1 - Part D
db.numbers.aggregate([
  {
    $set: { remainder: { $mod: ["$number", 2] } }
  },
  {
    $group: {
      _id: null,
      totalEven: {
        $sum: { $cond: [{ $eq: ["$remainder", 0] }, 1, 0] }
      },
      totalOdd: {
        $sum: { $cond: [{ $in: ["$remainder", [1, -1]] }, 1, 0] }
      }
    }
  },
  {
    $project: { _id: 0, 
        totalEven: 1, 
        totalOdd: 1 
    }
  }
]);

// TASK 1 - Part E
db.numbers.aggregate([
  {
    $set: { remainder: { $mod: ["$number", 2] } }
  },
  {
    $match: { remainder: 0 }
  },
  {
    $sort: { number: -1 }
  },
  {
    $limit: 3
  },
  {
    $project: { 
        _id: 0, 
        number: 1 }
  }
]);

// TASK 1 - Challenge
db.numbers.aggregate([
  {
    $set: {
      remainder: { $mod: ["$number", 2] },
      type: {
        $cond: [{ $eq: [{ $mod: ["$number", 2] }, 0] }, "Even", "Odd"]
      }
    }
  },
  {
    $project: { _id: 0, 
        number: 1, 
        type: 1 
    }
  }
]);

// TASK 02 Leap Year Program
/*
db.years.insertMany([
  { year: 2004 }, 
  { year: 2026 }, 
  { year: 1900 },
  { year: 2000 }, 
  { year: 2100 },
  { year: 2400 }, 
  { year: 2016 },
  { year: 2025 },
  { year: 1800 },
  { year: 2003},
  { year: 2020 },
  { year: 1999 }
]);
*/

// TASK 2 - Part A
db.years.aggregate([
  {
    $set: {
      rem4: { $mod: ["$year", 4] },
      rem100: { $mod: ["$year", 100] },
      rem400: { $mod: ["$year", 400] }
    }
  },
  {
    $project: {
      _id: 0,
      year: 1,
      rem4: 1,
      rem100: 1,
      rem400: 1
    }
  }
]);

// TASK 2 - Part B
// A year is a leap year if (year % 400 == 0) OR (year % 4 == 0 AND year % 100 != 0)
db.years.aggregate([
  {
    $set: {
      rem4: { $mod: ["$year", 4] },
      rem100: { $mod: ["$year", 100] },
      rem400: { $mod: ["$year", 400] }
    }
  },
  {
    $match: {
      $or: [
        { rem400: 0 },
        { $and: [{ rem4: 0 }, { rem100: { $ne: 0 } }] }
      ]
    }
  },
  {
    $project: { _id: 0, year: 1 }
  },
  {
    $sort: { year: 1 }
  }
]);

// TASK 2 - Part C
db.years.aggregate([
  {
    $set: {
      rem4: { $mod: ["$year", 4] },
      rem100: { $mod: ["$year", 100] },
      rem400: { $mod: ["$year", 400] }
    }
  },
  {
    $match: {
      $nor: [
        { rem400: 0 },
        { $and: [{ rem4: 0 }, { rem100: { $ne: 0 } }] }
      ]
    }
  },
  {
    $project: { _id: 0, year: 1 }
  },
  {
    $sort: { year: 1 }
  }
]);

// TASK 2 - Part D
db.years.aggregate([
  {
    $set: {
      rem4: { $mod: ["$year", 4] },
      rem100: { $mod: ["$year", 100] },
      rem400: { $mod: ["$year", 400] },
      isLeap: {
        $cond: [
          {
            $or: [
              { $eq: [{ $mod: ["$year", 400] }, 0] },
              { $and: [{ $eq: [{ $mod: ["$year", 4] }, 0] }, { $ne: [{ $mod: ["$year", 100] }, 0] }] }
            ]
          },
          1,
          0
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      totalLeapYears: { $sum: "$isLeap" },
      totalNonLeapYears: { $sum: { $subtract: [1, "$isLeap"] } }
    }
  },
  {
    $project: { _id: 0, 
        totalLeapYears: 1, 
        totalNonLeapYears: 1 
    }
  }
]);

// TASK 2 - Part E
db.years.aggregate([
  {
    $set: {
      rem4: { $mod: ["$year", 4] },
      rem100: { $mod: ["$year", 100] },
      rem400: { $mod: ["$year", 400] }
    }
  },
  {
    $match: {
      $or: [
        { rem400: 0 },
        { $and: [{ rem4: 0 }, { rem100: { $ne: 0 } }] }
      ]
    }
  },
  {
    $group: {
      _id: null,
      latestLeapYear: { $max: "$year" },
      oldestLeapYear: { $min: "$year" }
    }
  },
  {
    $project: {
         _id: 0, 
         latestLeapYear: 1, 
         oldestLeapYear: 1 }
  }
]);

// TASK 2 - Challenge
db.years.aggregate([
  {
    $set: {
      daysInYear: {
        $cond: [
          {
            $or: [
              { $eq: [{ $mod: ["$year", 400] }, 0] },
              { $and: [{ $eq: [{ $mod: ["$year", 4] }, 0] }, 
              { $ne: [{ $mod: ["$year", 100] }, 0] }] }
            ]
          },
          366,
          365
        ]
      }
    }
  },
  {
    $project: { _id: 0, year: 1, daysInYear: 1 }
  }
]);

// TASK 3: Marksheet
/*
db.marksheet.insertMany([
  { rollNo: 101, name: "Amimah", course: "ADSE", urdu: 85, english: 90, mathematics: 95, physics: 88, chemistry: 82, computer: 96, islamiat: 91 },
  { rollNo: 102, name: "Ahmed", course: "DISM", urdu: 35, english: 60, mathematics: 45, physics: 50, chemistry: 55, computer: 65, islamiat: 70 }, 
  { rollNo: 103, name: "Anusha", course: "ADSE", urdu: 70, english: 75, mathematics: 80, physics: 65, chemistry: 60, computer: 85, islamiat: 78 },
  { rollNo: 104, name: "Anas", course: "HDSE", urdu: 92, english: 88, mathematics: 94, physics: 90, chemistry: 89, computer: 98, islamiat: 95 }, 
  { rollNo: 105, name: "Amna", course: "DISM", urdu: 50, english: 55, mathematics: 32, physics: 48, chemistry: 52, computer: 60, islamiat: 58 }, 
  { rollNo: 106, name: "Adeeba", course: "HDSE", urdu: 65, english: 70, mathematics: 65, physics: 60, chemistry: 55, computer: 75, islamiat: 68 }, 
  { rollNo: 107, name: "Ali", course: "ADSE", urdu: 25, english: 30, mathematics: 20, physics: 35, chemistry: 28, computer: 40, islamiat: 35 }, 
  { rollNo: 108, name: "Asher", course: "DISM", urdu: 72, english: 74, mathematics: 76, physics: 78, chemistry: 70, computer: 80, islamiat: 82 },
  { rollNo: 109, name: "Alishba", course: "HDSE", urdu: 65, english: 70, mathematics: 65, physics: 60, chemistry: 55, computer: 75, islamiat: 68 }, 
  { rollNo: 110, name: "Ayesha", course: "ADSE", urdu: 88, english: 82, mathematics: 85, physics: 80, chemistry: 78, computer: 90, islamiat: 86 }
]);
*/

// TASK 3 - Part A
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: {
        $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"]
      }
    }
  },
  {
    $set: {
      percentage: {
        $round: [{ $multiply: [{ $divide: ["$totalMarks", 700] }, 100] }, 2]
      }
    }
  },
  {
    $project: {
      _id: 0,
      rollNo: 1,
      name: 1,
      totalMarks: 1,
      percentage: 1
    }
  }
]);

// TASK 3 - Part B
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }
    }
  },
  {
    $sort: { totalMarks: -1 }
  },
  {
    $project: {
      _id: 0,
      rollNo: 1,
      name: 1,
      totalMarks: 1
    }
  }
]);

// TASK 3 - Part C
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }
    }
  },
  {
    $sort: { totalMarks: -1 }
  },
  {
    $limit: 3
  },
  {
    $project: { _id: 0, 
        rollNo: 1, 
        name: 1, 
        totalMarks: 1
     }
  }
]);

// TASK 3 - Part D
db.marksheet.aggregate([
  {
    $match: {
      $or: [
        { urdu: { $lt: 40 } },
        { english: { $lt: 40 } },
        { mathematics: { $lt: 40 } },
        { physics: { $lt: 40 } },
        { chemistry: { $lt: 40 } },
        { computer: { $lt: 40 } },
        { islamiat: { $lt: 40 } }
      ]
    }
  },
  {
    $project: { _id: 0, name: 1, rollNo: 1, course: 1 }
  }
]);

// TASK 3 - Part E
// Part D uses $or to check if *any* subject is below 40. 
// Part E checks that *every* subject is >= 40 (using $gte on all subjects) AND percentage >= 50.
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] },
      percentage:{
         $round: [ { $multiply: [{ $divide: [{ $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }, 700] }, 100] },
     1 ]
      } 
    }
  },
  {
    $match: {
      urdu: { $gte: 40 },
      english: { $gte: 40 },
      mathematics: { $gte: 40 },
      physics: { $gte: 40 },
      chemistry: { $gte: 40 },
      computer: { $gte: 40 },
      islamiat: { $gte: 40 },
      percentage: { $gte: 50 }
    }
  },
  {
    $project: { 
        _id: 0, 
        rollNo: 1, 
        name: 1, 
        percentage: 1 
    }
  }
]);

// TASK 3 - Part F
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }
    }
  },
  {
    $group: {
      _id: null,
      totalStudents: { $sum: 1 },
      avgTotalMarks: { $avg: "$totalMarks" },
      highestTotalMarks: { $max: "$totalMarks" },
      lowestTotalMarks: { $min: "$totalMarks" }
    }
  },
  {
    $project: { _id: 0, 
        totalStudents: 1, 
        avgTotalMarks: 1, 
        highestTotalMarks: 1, 
        lowestTotalMarks: 1 
    }
  }
]);

// TASK 3 - Part G
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] },
      percentage: { $multiply: [{ $divide: [{ $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }, 700] }, 100] }
    }
  },
  {
    $group: {
      _id: "$course",
      numberOfStudents: { $sum: 1 },
      avgPercentage: { $avg: "$percentage" },
      highestTotalMarks: { $max: "$totalMarks" }
    }
  },
  {
    $sort: { avgPercentage: -1 }
  },
  {
    $project: {
      _id: 0,
      course: "$_id",
      numberOfStudents: 1,
      avgPercentage: 1,
      highestTotalMarks: 1
    }
  }
]);

// TASK 3 - Part H
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }
    }
  },
  {
    $sort: { totalMarks: -1 }
  },
  {
    $skip: 4
  },
  {
    $limit: 4
  },
  {
    $project: { _id: 0,
         rollNo: 1, 
         name: 1, 
         totalMarks: 1 }
  }
]);

// TASK 3 - Challenge
db.marksheet.aggregate([
  {
    $set: {
      totalMarks: { $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] },
      percentage: {
        $round: [ { $multiply: [{ $divide: [{ $add: ["$urdu", "$english", "$mathematics", "$physics", "$chemistry", "$computer", "$islamiat"] }, 700] }, 100] },
      2 ]
    }
      }
  },
  {
    $set: {
      grade: {
        $switch: {
          branches: [
            { case: { $gte: ["$percentage", 80] }, then: "A-1" },
            { case: { $gte: ["$percentage", 70] }, then: "A" },
            { case: { $gte: ["$percentage", 60] }, then: "B" },
            { case: { $gte: ["$percentage", 50] }, then: "C" },
            { case: { $gte: ["$percentage", 40] }, then: "D" }
          ],
          default: "F"
        }
      }
    }
  },
  {
    $project: { _id: 0, 
        rollNo: 1, 
        name: 1, 
        percentage: 1, 
        grade: 1 }
  }
]);

// TASK 4: Inventory Management System
/*
db.inventory.insertMany([
  { itemCode: "ITM-001", itemName: "Wireless Mouse", category: "Accessories", quantity: 45, unitPrice: 1200, reorderLevel: 20, supplier: "TechSource" },
  { itemCode: "ITM-002", itemName: "Mechanical Keyboard", category: "Accessories", quantity: 5, unitPrice: 4500, reorderLevel: 10, supplier: "KeyCraft" },
  { itemCode: "ITM-003", itemName: "27-inch Monitor", category: "Displays", quantity: 0, unitPrice: 35000, reorderLevel: 5, supplier: "ViewPro" },
  { itemCode: "ITM-004", itemName: "USB-C Hub", category: "Accessories", quantity: 12, unitPrice: 2500, reorderLevel: 15, supplier: "ConnectPlus" },
  { itemCode: "ITM-005", itemName: "Gaming Headset", category: "Audio", quantity: 0, unitPrice: 6500, reorderLevel: 8, supplier: "SoundMax" },
  { itemCode: "ITM-006", itemName: "Laptop Stand", category: "Accessories", quantity: 8, unitPrice: 1800, reorderLevel: 10, supplier: "ErgoTech" },
  { itemCode: "ITM-007", itemName: "Office Chair", category: "Furniture", quantity: 2, unitPrice: 18000, reorderLevel: 4, supplier: "ComfortPlus" },
  { itemCode: "ITM-008", itemName: "Desk Lamp", category: "Furniture", quantity: 25, unitPrice: 3000, reorderLevel: 5, supplier: "LightHouse" },
  { itemCode: "ITM-009", itemName: "External SSD 1TB", category: "Storage", quantity: 18, unitPrice: 22000, reorderLevel: 10, supplier: "DataDrive" },
  { itemCode: "ITM-010", itemName: "Webcam 1080p", category: "Displays", quantity: 30, unitPrice: 5500, reorderLevel: 12, supplier: "ViewPro" },
  { itemCode: "ITM-011", itemName: "HDMI Cable 2m", category: "Cables", quantity: 60, unitPrice: 800, reorderLevel: 20, supplier: "WireCraft" }, 
  { itemCode: "ITM-012", itemName: "Bluetooth Speaker", category: "Audio", quantity: 14, unitPrice: 4000, reorderLevel: 10, supplier: "SoundMax" }
]);
*/

// --- PART 1: Operations ---

// 1. Add new item with insertOne()
db.inventory.insertOne({
  itemCode: "ITM-013",
  itemName: "Ethernet Cable 5m",
  category: "Cables",
  quantity: 50,
  unitPrice: 1200,
  reorderLevel: 15,
  supplier: "WireCraft"
});

// 2. Record sale: Customer buys 3 units of ITM-001
db.inventory.updateOne(
  { itemCode: "ITM-001" },
  { $inc: { quantity: -3 } }
);

// 3. Restock: Add 50 units to low-stock item ITM-002
db.inventory.updateOne(
  { itemCode: "ITM-002" },
  { $inc: { quantity: 50 } }
);

// 4. Price increase: Increase unitPrice of 'Furniture' category by 5%
db.inventory.updateMany(
  { category: "Furniture" },
  { $mul: { unitPrice: 1.05 } }
);

// 5a. Upsert with existing code (updates existing item)
db.inventory.updateOne(
  { itemCode: "ITM-001" },
  { $set: { unitPrice: 1250 } },
  { upsert: true }
);

// 5b. Upsert with new code (inserts new item)
db.inventory.updateOne(
  { itemCode: "ITM-999" },
  { 
    $set: { 
      itemName: "Wireless Charger", 
      category: "Accessories", 
      quantity: 25, 
      unitPrice: 3000, 
      reorderLevel: 10, 
      supplier: "TechSource" 
    } 
  },
  { upsert: true }
);

// 6. Remove a discontinued item
db.inventory.deleteOne({ itemCode: "ITM-999" });

// --- PART 2: Reports ---

// REPORT A: Stock value per item
db.inventory.aggregate([
  {
    $set: {
      stockValue: { $multiply: ["$quantity", "$unitPrice"] }
    }
  },
  {
    $project: {
      _id: 0,
      itemName: 1,
      quantity: 1,
      unitPrice: 1,
      stockValue: 1
    }
  }
]);

// REPORT B: Total inventory value
db.inventory.aggregate([
  {
    $group: {
      _id: null,
      totalInventoryValue: {
        $sum: { $multiply: ["$quantity", "$unitPrice"] }
      }
    }
  },
  {
    $project: { _id: 0, totalInventoryValue: 1 }
  }
]);

// REPORT C: Category-wise summary
db.inventory.aggregate([
  {
    $set: {
      stockValue: { $multiply: ["$quantity", "$unitPrice"] }
    }
  },
  {
    $group: {
      _id: "$category",
      numberOfItems: { $sum: 1 },
      totalQuantity: { $sum: "$quantity" },
      avgUnitPrice: { $avg: "$unitPrice" },
      highestUnitPrice: { $max: "$unitPrice" },
      lowestUnitPrice: { $min: "$unitPrice" },
      totalStockValue: { $sum: "$stockValue" }
    }
  },
  {
    $sort: { totalStockValue: -1 }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      numberOfItems: 1,
      totalQuantity: 1,
      avgUnitPrice: 1,
      highestUnitPrice: 1,
      lowestUnitPrice: 1,
      totalStockValue: 1
    }
  }
]);

// REPORT D: Reorder list with shortage field
db.inventory.aggregate([
  {
    $set: {
      shortage: { $subtract: ["$reorderLevel", "$quantity"] }
    }
  },
  {
    $match: {
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    }
  },
  {
    $project: {
      _id: 0,
      itemCode: 1,
      itemName: 1,
      quantity: 1,
      reorderLevel: 1,
      shortage: 1
    }
  }
]);

// REPORT E: Out-of-stock items (zero quantity)
db.inventory.aggregate([
  {
    $match: { quantity: 0 }
  },
  {
    $project: {
      _id: 0,
      itemName: 1,
      itemCode: 1
    }
  }
]);

// REPORT F: Five most valuable items by stockValue
db.inventory.aggregate([
  {
    $set: {
      stockValue: { $multiply: ["$quantity", "$unitPrice"] }
    }
  },
  {
    $sort: { stockValue: -1 }
  },
  {
    $limit: 5
  },
  {
    $project: {
      _id: 0,
      itemName: 1,
      stockValue: 1
    }
  }
]);

// REPORT G: Discount preview (10% off unitPrice, rounded to 0 decimals)
// Question: Has this changed the prices stored in the collection?
// Answer: No. Aggregation pipelines do not modify stored documents; they only transform the output stream. 
// Proof can be seen by running db.inventory.find() afterwards, which displays the original unchanged unitPrice values.
db.inventory.aggregate([
  {
    $set: {
      discountedPrice: {
        $round: [{ $multiply: ["$unitPrice", 0.9] }, 0]
      }
    }
  },
  {
    $project: {
      _id: 0,
      itemCode: 1,
      itemName: 1,
      unitPrice: 1,
      discountedPrice: 1
    }
  }
]);

// Proof check
db.inventory.find({}, { _id: 0, itemCode: 1, itemName: 1, unitPrice: 1 });

// REPORT H: Pagination (Page 2, 5 items per page, sorted alphabetically by itemName)
db.inventory.aggregate([
  {
    $sort: { itemName: 1 }
  },
  {
    $skip: 5
  },
  {
    $limit: 5
  },
  {
    $project: {
      _id: 0,
      itemCode: 1,
      itemName: 1,
      category: 1,
      quantity: 1,
      unitPrice: 1
    }
  }
]);

// (Task 4 Operations vs Report G)
// Task 1 step 4 uses update commands ($mul) which permanently modify data on disk.
// Report G uses an aggregation pipeline stage ($set) which computes calculated fields on-the-fly 
// in the cursor stream without altering persistent records.

// // TASK 4 - Challenge: Category with the highest total stock value
db.inventory.aggregate([
  {
    $set: { stockValue: { $multiply: ["$quantity", "$unitPrice"] } }
  },
  {
    $group: {
      _id: "$category",
      totalStockValue: { $sum: "$stockValue" }
    }
  },
  {
    $sort: { totalStockValue: -1 }
  },
  {
    $limit: 1
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalStockValue: 1
    }
  }
]);