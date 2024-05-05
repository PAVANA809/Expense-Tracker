import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Expenses, { ExpenseType } from "../models/expense";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/add",
  [
    check("category", "Expense category is required").isString(),
    check("type", "Expense type is required").isString(),
    check("amount", "Amount is required").isNumeric(),
    check("date", "Date is required").isISO8601().toDate(),
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
        expenses.expenseList.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
          return 0;
        });
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
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startDate = req.query.startDate
      ? new Date(`${req.query.startDate}T00:00:00.000Z`)
      : startOfMonth;

    const endDate = req.query.endDate
      ? new Date(`${req.query.endDate}T23:59:59.999Z`)
      : endOfDay;
    
    const result = await Expenses.aggregate([
      {
        $match: {
          userId: req.userId,
        },
      },
      {
        $addFields: {
          expenseList: {
            $filter: {
              input: "$expenseList",
              as: "expense", 
              cond: {
                $and: [
                  { $gte: ["$$expense.date", new Date(startDate)] },
                  { $lte: ["$$expense.date", new Date(endDate)] },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          totalDocuments: { $size: "$expenseList" },
          expenseList: { $slice: ["$expenseList", skip, pageSize] },
        },
      },
    ]);

    if (result) {
      return res.status(200).json({
        data: result[0].expenseList,
        pagination: {
          total: result[0].totalDocuments,
          page: pageNumber,
          pages: Math.ceil(result[0].totalDocuments / pageSize),
        },
      });
    } else {
      return res.status(200).json({ expenses: [] });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
