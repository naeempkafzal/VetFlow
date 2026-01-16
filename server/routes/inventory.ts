import express from "express";
import { db, pool } from "../db"; // We use raw SQL to bypass schema file for new features

const router = express.Router();

// GET: List Inventory
router.get("/", async (_req: any, res: any) => {
  try {
    const result = await pool.query(`
      SELECT * FROM inventory ORDER BY item_name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET: Forecast (Pseudo-AI Logic)
router.get("/forecast/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Simple Linear Regression to predict "Days Left"
    // We assume a constant daily consumption rate if we don't have history logs
    // Logic: (Current / DailyRate) - Current = Days until 0.
    // For demo, we assume Daily Rate = 2% of initial stock if current < initial.
    
    const itemResult = await pool.query("SELECT * FROM inventory WHERE id = $1", [id]);
    if (!itemResult.rows[0]) return res.status(404).json({ error: "Item not found" });
    
    const item = itemResult.rows[0];
    let predictedDays = 0;

    if (item.quantity > 0 && item.quantity < item.initial_stock) {
      // Calculate depletion rate
      const daysPassed = Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const consumed = item.initial_stock - item.quantity;
      const dailyRate = Math.max(0.5, consumed / daysPassed); // At least 0.5 item/day
      
      const remaining = item.quantity / dailyRate;
      predictedDays = Math.floor(remaining);
    } else {
      predictedDays = item.quantity * 10; // Fallback for new items (10 days * qty)
    }

    // Calculate depletion date
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + predictedDays);

    res.json({ 
      itemId: item.id, 
      itemName: item.itemName, 
      currentStock: item.quantity, 
      predictedEmptyDate: depletionDate.toISOString().split('T')[0],
      status: predictedDays < item.lowStockThreshold ? 'CRITICAL' : 'OK'
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST: Create Item
router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body;
    const payload = {
      itemName: body.itemName,
      quantity: parseInt(body.quantity.toString()),
      cost: parseFloat(body.cost.toString()),
      lowStockThreshold: parseInt(body.lowStockThreshold.toString()),
    };

    const result = await pool.query(
      "INSERT INTO inventory (item_name, quantity, cost, low_stock_threshold, initial_stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [payload.itemName, payload.quantity, payload.cost, payload.lowStockThreshold, payload.quantity]
    );

    // Auto-create Low Stock Notification
    if (payload.quantity < payload.lowStockThreshold) {
      await pool.query(
        "INSERT INTO notifications (type, title, message, target_date) VALUES ($1, $2, $3, NOW())",
        ['stock', 'Low Stock', `Item ${payload.itemName} added below threshold`, new Date()]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// NEW: POST: Manual Deduct Stock (Inventory Management)
router.post("/deduct/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // { amount: 5 }

    // Update DB
    const result = await pool.query(
      "UPDATE inventory SET quantity = quantity - $1, current_stock = current_stock - $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );
    
    // Notify
    const item = result.rows[0];
    await pool.query(
      "INSERT INTO notifications (type, title, message, target_date) VALUES ($1, $2, $3, NOW())",
      ['stock', 'Stock Adjusted', `Deducted ${amount} units of ${item.itemName}`, new Date()]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;