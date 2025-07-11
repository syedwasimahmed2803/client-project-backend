// src/storage/CounterStorage.js
const Counter = require('../models/Counter');

class CounterStorage {
  static async getMonthlyCaseSequence() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 07
    const year = String(now.getFullYear()).slice(-2);          // 25
    const counterId = `CMA${year}-${month}`;                 // CMA25-07

    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).lean();

    const paddedSeq = String(counter.seq).padStart(2, '0');     // 01, 02, ...
    return `CMA${year}-${month}${paddedSeq}`;
  }
}

module.exports = CounterStorage;
