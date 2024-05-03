import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Expenses, { ExpenseType } from "../models/expense";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
    "/add",
    [
        check("type", "Expense type is required").isString(),
        check("amount", "Amount is required").isNumeric(),
        check("date", "Date is required").isISO8601().toDate()
  ],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const newExpense: ExpenseType = req.body;

      const expensesObj = await Expenses.findOne({ userId: req.userId });
      if (expensesObj) {
        const expenses = new Expenses(expensesObj);
        expenses.expenseList.push(newExpense);
        await expenses.save();
        res.status(200).json({ message: "Added new expense" });
      } else {
        const newExpenses = new Expenses({
          userId: req.userId,
          expenseList: [newExpense],
        });
        await newExpenses.save();
        res.status(200).json({ message: "Added new expense" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/search", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await Expenses.findOne({ userId: req.userId });
    if (result) {
      return res.status(200).json({ expenses: result.expenseList });
    } else {
      return res.status(200).json({ expenses: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
})

export default router;
