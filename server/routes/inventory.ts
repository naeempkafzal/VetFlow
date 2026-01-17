import express from "express";
import { db, pool } from "../db"; // Import both to remove ambiguity
import { inventory, notifications } from "../../shared/schema";

const router = express.Router();

// --- 1. GET: List Inventory (Uses Drizzle) ---
// Returns: id, item_name, quantity, current_stock, cost, low_stock_threshold
router.get("/", async (_req: any, res: any) => {
  try {
    const items = await db.select().from(inventory);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- 2. GET: AI Forecast (Uses Raw Pool) ---
// Calculates predicted empty date based on current stock levels
router.get("/forecast/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Use raw SQL to fetch row for context
    const itemResult = await pool.query(
      `SELECT id, item_name, quantity, initial_stock, min_stock_level FROM inventory WHERE id = $1`,
      [id]
    );

    if (!itemResult.rows[0]) return res.status(404).json({ error: "Item not found" });

    const item = itemResult.rows[0];
    let predictedDays = 0;

    if (item.quantity > 0 && item.quantity < item.initial_stock) {
      // Calculate consumption
      const now = new Date();
      const created = new Date(item.created_at || Date.now());
      const daysPassed = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const consumed = item.initial_stock - item.quantity;
      
      // Calculate daily rate
      const dailyRate = Math.max(0.5, consumed / daysPassed); // At least 0.5 item/day
      
      const remaining = item.quantity / dailyRate;
      predictedDays = Math.floor(remaining);
    } else {
      predictedDays = item.quantity * 10; 
    }

    // Calculate depletion date
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + predictedDays);

    res.json({ 
      itemId: item.id, 
      itemName: item.item_name, 
      quantity: item.quantity, 
      currentStock: item.quantity,
      predictedEmptyDate: depletionDate.toISOString().split('T')[0],
      status: predictedDays <= item.minStock_level ? 'CRITICAL' : 'OK'
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- 3. POST: Create Item (Uses Drizzle) ---
router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body;
    const payload = {
      itemName: body.itemName,
      unit: body.unit || 'pcs',
      quantity: parseInt(body.quantity.toString()),
      cost: body.cost.toString(),
      lowStockThreshold: parseInt(body.lowStockThreshold.toString()),
      initialStock: parseInt(body.quantity.toString())
    };

    const [newItem] = await db.insert(inventory).values(payload).returning();

    // Auto-create Low Stock Notification
    if (payload.quantity < payload.lowStockThreshold) {
      // Insert into notifications table using Drizzle
      await db.insert(notifications).values({
        type: 'stock',
        title: 'Low Stock Alert',
        message: `Item ${payload.itemName} is running low (${payload.quantity} items).`,
        targetDate: new Date()
      });
    }

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- 4. POST: Manual Deduct Stock (Uses Raw Pool)
// Updates DB and creates notification
router.post("/deduct/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; 

    // Update DB (Raw SQL)
    const result = await pool.query(
      `UPDATE inventory SET quantity = quantity - $1, current_stock = current_stock - $1, last_updated = NOW() WHERE id = $2 RETURNING *`,
      [amount, id]
    );
    
    // Notify
    const item = result.rows[0];
    await pool.query(
      `INSERT INTO notifications (type, title, message, target_date) VALUES ($1, $2, $3, NOW())`,
      ['stock', 'Stock Adjusted', `Deducted ${amount} units of ${item.itemName}`, new Date()]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;